import { api } from "@/lib/api";
import { Metadata } from "next";
import { cacheTag } from "next/cache";
import Todos from "./todos";

export const metadata: Metadata = {
  title: "TODO List",
};

const HomePage = async () => {
  const todos = await getTodos();

  return <Todos todos={todos} />;
};

export default HomePage;

const getTodos = async () => {
  "use cache";

  cacheTag("todos");

  const response = await api.api.todos.$get();

  if (!response.ok) {
    throw new Error(`Failed to load todos (${response.status})`);
  }

  return await response.json();
};
