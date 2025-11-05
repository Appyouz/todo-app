import React, { createContext, useContext, useState, ReactNode } from 'react';

type TodoItem = {
  id: string;
  title: string;
};

type TodosContextType = ReturnType<typeof useTodosLogic> | undefined;

// State Logic
const useTodosLogic = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const addTask = (title: string) => {
    const newTask: TodoItem = { id: Date.now().toString(), title: title };
    setTodos((prevTodos) => [...prevTodos, newTask]);
  };

  const clearTodos = () => { setTodos([]); };
  const deleteTask = (id: string) => { /* logic */ };
  const updateTask = (id: string, newTitle: string) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            title: newTitle,
          }
        }
        return todo;
      })
    })

  };

  return { todos, addTask, deleteTask, updateTask, clearTodos };
};

// Context Setup
const TodosContext = createContext<TodosContextType>(undefined);

// Provider Component
export function TodosProvider({ children }: { children: ReactNode }) {
  const value = useTodosLogic(); // The state is created ONCE here.

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
}

// Hooks
export const useTodos = () => {
  const context = useContext(TodosContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodosProvider');
  }
  return context;
};

export default TodosProvider;
