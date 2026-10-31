import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toastResult } from "@/lib/toast";
import type { Todo } from "@/lib/types";
import { useTransition } from "react";
import { createTodo } from "./actions";
import TodoForm from "./todo-form";

const NewTodo = ({
  addOptimisticNewTodo,
}: {
  addOptimisticNewTodo: (todo: Pick<Todo, "title" | "description">) => void;
}) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Card className="mx-auto w-100">
      <CardHeader>
        <CardTitle>New todo</CardTitle>
      </CardHeader>

      <TodoForm
        disabled={isPending}
        fieldsClassName="px-(--card-spacing)"
        onSubmit={(values, reset) => {
          startTransition(async () => {
            addOptimisticNewTodo({
              title: values.title,
              description: values.description ?? null,
            });

            const created = await toastResult(
              createTodo(values.title, values.description),
              {
                success: "Todo created",
                error: "Failed to create todo",
              },
            );

            if (created) {
              reset();
            }
          });
        }}
        footer={
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add todo"}
            </Button>
          </CardFooter>
        }
      />
    </Card>
  );
};

export default NewTodo;
