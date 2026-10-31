"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Todo } from "@/lib/types";
import TodoForm, { type TodoFormValues } from "./todo-form";

const EditTodo = ({
  todo,
  open,
  onOpenChange,
  onSave,
}: {
  todo: Todo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: TodoFormValues) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit todo</DialogTitle>
        </DialogHeader>

        <TodoForm
          defaultValues={{
            title: todo.title,
            description: todo.description ?? "",
          }}
          onSubmit={onSave}
          footer={
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          }
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditTodo;
