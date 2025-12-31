
import React, { useState } from 'react';
import { Todo } from '../../types';
import TodoItem from './TodoItem';

interface SomedayColumnProps {
  todos: Todo[];
  onAddTodo: (text: string) => void;
  onUpdateTodo: (todo: Todo) => void;
  onDeleteTodo: (id: string) => void;
}

const SomedayColumn: React.FC<SomedayColumnProps> = ({ todos, onAddTodo, onUpdateTodo, onDeleteTodo }) => {
  const [newTodoText, setNewTodoText] = useState('');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTodo(newTodoText);
    setNewTodoText('');
  };

  return (
    <div className="flex-shrink-0 w-64 md:w-80 border-r border-gray-200 flex flex-col bg-gray-50/50">
      <div className="p-3 border-b border-gray-200 bg-white">
        <h2 className="font-bold uppercase text-xs tracking-wider text-gray-500">
          Someday
        </h2>
        <p className="text-2xl font-light text-gray-400">
          Maybe
        </p>
      </div>
      <div className="flex-grow overflow-y-auto p-3 space-y-2">
        {todos.map(todo => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onUpdate={onUpdateTodo}
            onDelete={onDeleteTodo}
          />
        ))}
      </div>
      <div className="flex-shrink-0 p-3 border-t border-gray-200 bg-gray-50">
        <form onSubmit={handleAddTodo}>
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a task..."
            className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm placeholder-gray-400"
          />
        </form>
      </div>
    </div>
  );
};

export default SomedayColumn;
