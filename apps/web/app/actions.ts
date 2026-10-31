"use server";

import { api } from "@/lib/api";
import { updateTag } from "next/cache";

export const createTodo = async (title: string, description?: string) => {
  const response = await api.api.todos.$post({
    json: {
      title,
      description,
    },
  });

  if (!response.ok) {
    return false;
  }

  updateTag("todos");

  return true;
};

export const updateTodo = async (
  id: string,
  title: string,
  description?: string,
) => {
  const response = await api.api.todos[":id"].$put({
    param: {
      id,
    },
    json: {
      title,
      description,
    },
  });

  if (!response.ok) {
    return false;
  }

  updateTag("todos");

  return true;
};

export const deleteTodo = async (id: string) => {
  const response = await api.api.todos[":id"].$delete({
    param: {
      id,
    },
  });

  if (!response.ok) {
    return false;
  }

  updateTag("todos");

  return true;
};

export const doneTodo = async (id: string) => {
  const response = await api.api.todos[":id"].done.$patch({
    param: {
      id,
    },
  });

  if (!response.ok) {
    return false;
  }

  updateTag("todos");

  return true;
};
