"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toastResult } from "@/lib/toast";
import type { Todo as TodoType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import {
  ComponentProps,
  ReactNode,
  useOptimistic,
  useState,
  useTransition,
  ViewTransition,
} from "react";
import { deleteTodo, doneTodo, updateTodo } from "./actions";
import EditTodo from "./edit-todo";
import NewTodo from "./new-todo";
import type { TodoFormValues } from "./todo-form";

const Todos = ({ todos }: { todos: TodoType[] }) => {
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos);

  const notDoneTodos = optimisticTodos.filter((todo) => !todo.done);
  const doneTodos = optimisticTodos.filter((todo) => todo.done);

  const addOptimisticNewTodo: ComponentProps<
    typeof NewTodo
  >["addOptimisticNewTodo"] = (todo) => {
    const now = new Date().toISOString();

    setOptimisticTodos((todos) => [
      {
        id: nanoid(),
        title: todo.title,
        description: todo.description,
        done: false,
        createdAt: now,
        updatedAt: now,
      },
      ...todos,
    ]);
  };

  // Applies changes and moves the todo to the front, matching the server's
  // updatedAt-descending order.
  const touchOptimisticTodo = (id: string, changes: Partial<TodoType>) => {
    setOptimisticTodos((todos) => {
      const todo = todos.find((todo) => todo.id === id);

      if (!todo) {
        return todos;
      }

      return [
        { ...todo, ...changes, updatedAt: new Date().toISOString() },
        ...todos.filter((todo) => todo.id !== id),
      ];
    });
  };

  const deleteOptimisticTodo: ComponentProps<
    typeof Todo
  >["deleteOptimisticTodo"] = (id) => {
    setOptimisticTodos((todos) => todos.filter((todo) => todo.id !== id));
  };

  const updateOptimisticTodo: ComponentProps<
    typeof Todo
  >["updateOptimisticTodo"] = (id, values) => {
    touchOptimisticTodo(id, {
      title: values.title,
      description: values.description ?? null,
    });
  };

  const doneOptimisticTodo: ComponentProps<
    typeof Todo
  >["doneOptimisticTodo"] = (id, done) => {
    touchOptimisticTodo(id, { done });
  };

  return (
    <>
      <NewTodo addOptimisticNewTodo={addOptimisticNewTodo} />

      <Tabs defaultValue="notDone" className="mx-auto my-10 w-100">
        <TabsList>
          <TabsTrigger value="notDone">Not Done</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
        </TabsList>

        <TabsContent value="notDone">
          {notDoneTodos.length === 0 ? (
            <EmptyState>Nothing to do. Add a todo above.</EmptyState>
          ) : (
            <ul className="flex flex-col gap-2">
              {notDoneTodos.map((todo) => (
                <li key={todo.id}>
                  <Todo
                    todo={todo}
                    deleteOptimisticTodo={deleteOptimisticTodo}
                    doneOptimisticTodo={doneOptimisticTodo}
                    updateOptimisticTodo={updateOptimisticTodo}
                  />
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
        <TabsContent value="done">
          {doneTodos.length === 0 ? (
            <EmptyState>No completed todos yet.</EmptyState>
          ) : (
            <ul className="flex flex-col gap-2">
              {doneTodos.map((todo) => (
                <li key={todo.id}>
                  <Todo
                    todo={todo}
                    deleteOptimisticTodo={deleteOptimisticTodo}
                    doneOptimisticTodo={doneOptimisticTodo}
                    updateOptimisticTodo={updateOptimisticTodo}
                  />
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Todos;

const EmptyState = ({ children }: { children: ReactNode }) => {
  return (
    <p className="rounded-xl py-10 text-center text-sm text-muted-foreground ring-1 ring-foreground/10">
      {children}
    </p>
  );
};

const Todo = ({
  todo,
  doneOptimisticTodo,
  deleteOptimisticTodo,
  updateOptimisticTodo,
}: {
  todo: TodoType;
  doneOptimisticTodo: (id: string, done: boolean) => void;
  deleteOptimisticTodo: (id: string) => void;
  updateOptimisticTodo: (id: string, values: TodoFormValues) => void;
}) => {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState<
    "done" | "undo" | "delete" | null
  >(null);
  const [editing, setEditing] = useState(false);

  const handleEdit = (values: TodoFormValues) => {
    setEditing(false);

    startTransition(async () => {
      updateOptimisticTodo(todo.id, values);

      await toastResult(updateTodo(todo.id, values.title, values.description), {
        success: "Todo updated",
        error: "Failed to update todo",
      });
    });
  };

  // The API toggles the done status, so this marks as done or undone
  // depending on the todo's current state.
  const handleToggleDone = () => {
    const done = !todo.done;

    setConfirming(null);

    startTransition(async () => {
      doneOptimisticTodo(todo.id, done);

      await toastResult(doneTodo(todo.id), {
        success: done ? "Todo marked as done" : "Todo marked as not done",
        error: "Failed to update todo",
      });
    });
  };

  const handleDelete = () => {
    setConfirming(null);

    startTransition(async () => {
      deleteOptimisticTodo(todo.id);

      await toastResult(deleteTodo(todo.id), {
        success: "Todo deleted",
        error: "Failed to delete todo",
      });
    });
  };

  return (
    <ViewTransition name={`todo-${todo.id}`}>
      <Card>
        <CardHeader>
          <CardTitle className={cn(todo.done && "line-through")}>
            {todo.title}
          </CardTitle>
          {todo.description && (
            <CardDescription className={cn(todo.done && "line-through")}>
              {todo.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardFooter className="gap-2">
          {todo.done ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirming("undo")}
              disabled={isPending}
            >
              Undo
            </Button>
          ) : (
            <>
              <Button
                type="button"
                onClick={() => setConfirming("done")}
                disabled={isPending}
              >
                Done
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(true)}
                disabled={isPending}
              >
                Edit
              </Button>
            </>
          )}

          <Button
            type="button"
            variant="destructive"
            onClick={() => setConfirming("delete")}
            disabled={isPending}
          >
            Delete
          </Button>
        </CardFooter>

        <EditTodo
          todo={todo}
          open={editing}
          onOpenChange={setEditing}
          onSave={handleEdit}
        />

        <AlertDialog
          open={confirming !== null}
          onOpenChange={(open) => !open && setConfirming(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirming === "delete"
                  ? "Delete todo?"
                  : confirming === "undo"
                    ? "Mark as not done?"
                    : "Mark as done?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {confirming === "delete"
                  ? `"${todo.title}" will be permanently deleted.`
                  : confirming === "undo"
                    ? `"${todo.title}" will be moved back to the not done list.`
                    : `"${todo.title}" will be moved to the done list.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              {confirming === "delete" ? (
                <AlertDialogAction variant="destructive" onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              ) : (
                <AlertDialogAction onClick={handleToggleDone}>
                  {confirming === "undo" ? "Undo" : "Done"}
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </ViewTransition>
  );
};
