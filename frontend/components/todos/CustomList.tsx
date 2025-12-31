import React, { useState } from 'react';
import { Todo, DropLocation } from '../../types';
import TodoItem from './TodoItem';

interface CustomListProps {
  title: string;
  todos: Todo[];
  onAddTodo: (text: string) => void;
  onUpdateTodo: (todo: Todo) => void;
  onDeleteTodo: (id: string) => void;
  onTodoDrop: (todoId: string, newLocation: DropLocation) => void;
}

const CustomList: React.FC<CustomListProps> = ({ title, todos, onAddTodo, onUpdateTodo, onDeleteTodo, onTodoDrop }) => {
  const [newTodoText, setNewTodoText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
        onAddTodo(newTodoText);
        setNewTodoText('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const todoId = e.dataTransfer.getData('todoId');
    if (todoId) {
      onTodoDrop(todoId, { date: null, list: title });
    }
    setIsDragOver(false);
  };

  return (
    <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-2 -m-2 rounded-md transition-colors ${isDragOver ? 'bg-blue-50' : ''}`}
    >
      <h3 className="font-bold text-sm uppercase tracking-wider text-gray-900 mb-3">{title}</h3>
      <div className="space-y-1">
        {todos.map(todo => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onUpdate={onUpdateTodo}
            onDelete={onDeleteTodo}
          />
        ))}
      </div>
      <form onSubmit={handleAddTodo} className="mt-1">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 p-1 text-sm text-gray-500 placeholder-gray-400"
        />
      </form>
    </div>
  );
};

export default CustomList;