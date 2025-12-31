import { useState, useEffect, useCallback } from 'react';
import { Todo } from '../../types';
import api from '../../api/axios';

const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await api.get(`/todos`);
        if (response.status !== 200) {
          throw new Error('Failed to fetch todos');
        }
        const data: Todo[] = response.data;
        setTodos(data);
      } catch (error) {
        console.error("Could not fetch todos. Is the server running?", error);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = useCallback(async (text: string, date: string | null, list?: string) => {
    if (!text.trim()) return;
    try {
      const response = await api.post(`/todos`, { text, completed: false, date, list });
      if (response.status !== 201) {
        throw new Error('Failed to add todo');
      }
      const newTodo: Todo = response.data;
      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const updateTodo = useCallback(async (updatedTodo: Omit<Todo, 'id'> & { id: string }) => {
    try {
      const { id, ...todoData } = updatedTodo;
      const response = await api.put(`/todos/${id}`, todoData);
      if (response.status !== 200) {
        throw new Error('Failed to update todo');
      }
      const returnedTodo: Todo = response.data;
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === returnedTodo.id ? returnedTodo : todo
        )
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  const deleteTodo = useCallback(async (id: string) => {
    try {
      const response = await api.delete(`/todos/${id}`);
       if (response.status !== 200) {
        throw new Error('Failed to delete todo');
      }
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error(error);
    }
  }, []);

  return { todos, addTodo, updateTodo, deleteTodo };
};

export default useTodos;
