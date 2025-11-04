import { useState } from "react";
type TodoItem = {
  id: string;
  title: string;
};
export default function useTodos() {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const addTask = (title: string) => {
    // Create a new task object
    const newTask: TodoItem = {
      id: Date.now().toString(),
      title: title,
    };
    // Use the setTodos setter to add new task
    setTodos((prevTodos) => [...prevTodos, newTask]);
    console.log(`Adding task: ${title}`);
  };

  const clearTodos = () => {
    setTodos([]);
    console.log("All todos cleared!");
  };
  const deleteTask = (id: string) => {
    console.log(`Deleting task ID: ${id}`);
  };

  const updateTask = (id: string) => {
    console.log(`Updating task ID: ${id}`);
  };

  return {
    todos,
    addTask,
    deleteTask,
    updateTask,
    clearTodos,
  };
}
