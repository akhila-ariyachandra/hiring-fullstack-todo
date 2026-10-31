"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useId, type ReactNode } from "react";
import { Controller, useForm, type UseFormReset } from "react-hook-form";
import { z } from "zod";

const todoFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
});

export type TodoFormValues = z.infer<typeof todoFormSchema>;

const TodoForm = ({
  defaultValues = { title: "", description: "" },
  onSubmit,
  disabled,
  fieldsClassName,
  footer,
}: {
  defaultValues?: TodoFormValues;
  onSubmit: (
    values: TodoFormValues,
    reset: UseFormReset<TodoFormValues>,
  ) => void;
  disabled?: boolean;
  fieldsClassName?: string;
  footer: ReactNode;
}) => {
  const id = useId();

  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues,
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) => onSubmit(values, form.reset))}
      noValidate
      className="contents"
    >
      <FieldGroup className={fieldsClassName}>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`${id}-title`}>Title</FieldLabel>
              <Input
                {...field}
                id={`${id}-title`}
                aria-invalid={fieldState.invalid}
                placeholder="What needs doing?"
                autoComplete="off"
                disabled={disabled}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`${id}-description`}>Description</FieldLabel>
              <Textarea
                {...field}
                id={`${id}-description`}
                aria-invalid={fieldState.invalid}
                placeholder="Optional"
                disabled={disabled}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <FieldError errors={[form.formState.errors.root]} />
      </FieldGroup>

      {footer}
    </form>
  );
};

export default TodoForm;
