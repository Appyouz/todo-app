import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


type TodoItem = {
  id: string;
  title: string;
  isArchived: boolean;
  isCompleted: boolean;

  lastDurationMs: number | null;
  failurReason: string | null;
};

type TodosContextType = ReturnType<typeof useTodosLogic> | undefined;

const STORAGE_KEY = '@TodoApp:todos';

// State Logic
const useTodosLogic = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const addTask = (title: string) => {
    const newTask: TodoItem = {
      id: Date.now().toString(),
      title: title,
      isArchived: false,
      isCompleted: false,
      lastDurationMs: null,
      failurReason: null,
    };
    setTodos((prevTodos) => [...prevTodos, newTask]);
  };

  const archiveTask = (id: string) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          // Return a new object where isArchived status is True
          return {
            ...todo,
            isArchived: true,
          };
        }
        return todo;
      })
    })
  }

  const deleteArchivedTask = (id: string) => {
    setTodos((prevTodos) => {
      return prevTodos.filter((todo) => todo.isArchived === false)
    })
  };

  const clearTodos = () => { setTodos([]); };
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

  // Persistence storage function
  const saveTodos = async (currentTodos: TodoItem[]) => {
    try {
      const jsonValue = JSON.stringify(currentTodos)
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue)
      console.log("Data successfully saved to AsyncStorage")
    } catch (e) {
      console.error("Failed to save todos.", e)
    }
  }

  const loadTodos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY)

      if (jsonValue !== null) {
        const loadedTodos = JSON.parse(jsonValue)
        setTodos(loadedTodos)
      }
    } catch (e) {
      console.error('Failed to load todos.', e);
    }
  }

  // UseEffect Hooks for persistence 
  // Load data on app startup
  useEffect(() => {
    loadTodos();
  }, []);

  // Save data whenever the 'todos' state changes
  useEffect(() => {
    saveTodos(todos)
  }, [todos])


  // ToggleComplete
  const toggleComplete = (id: string) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isCompleted: !todo.isCompleted
          }
        }
        return todo;
      })
    })
  }


  const completeFocusSession = (
    id: string,
    durationMs: number,
    isSuccessful: boolean,
    reason: string | null = null
  ) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          if (isSuccessful) {
            return {
              ...todo,
              isCompleted: true,
              isArchived: false,
              lastDurationMs: durationMs,
              failureReason: null,
            };
          } else {
            return {
              ...todo,
              isCompleted: false,
              isArchived: true,
              lastDurationMs: durationMs,
              failureReason: reason,
            };
          }
        }
        return todo;
      })
    })

  }

  return {
    todos,
    addTask,
    archiveTask,
    deleteArchivedTask,
    updateTask,
    clearTodos,
    toggleComplete,
    completeFocusSession,
  };
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
