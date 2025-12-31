import React, { useState, useRef, useEffect } from 'react';
import { Todo, DropLocation } from '../../types';
import TodoItem from './TodoItem';
import { formatDate } from '../../utils/date';

interface DayColumnProps {
  date: Date;
  todos: Todo[];
  onAddTodo: (text: string) => void;
  onUpdateTodo: (todo: Todo) => void;
  onDeleteTodo: (id: string) => void;
  onTodoDrop: (todoId: string, newLocation: DropLocation) => void;
}

const DayColumn: React.FC<DayColumnProps> = ({ date, todos, onAddTodo, onUpdateTodo, onDeleteTodo, onTodoDrop }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [newTodoText, setNewTodoText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const isToday = formatDate(new Date()) === formatDate(date);
  
  useEffect(() => {
    if (activeIndex !== null) {
      inputRef.current?.focus();
    }
  }, [activeIndex]);

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      onAddTodo(newTodoText);
    }
    setNewTodoText('');
    setActiveIndex(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTodo();
    } else if (e.key === 'Escape') {
      setNewTodoText('');
      setActiveIndex(null);
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
      onTodoDrop(todoId, { date: formatDate(date), list: undefined });
    }
    setIsDragOver(false);
  };


  const monthDayYear = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).toUpperCase();

  const weekDay = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const placeholderCount = 15;

  return (
    <div 
        className={`flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-[calc(100%/7)] min-w-[200px] p-3 flex flex-col border-r border-gray-100 h-full transition-colors ${isDragOver ? 'bg-blue-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
    >
      <div className={`text-left mb-4 flex-shrink-0`}>
        <p className="text-xs text-gray-400 font-medium tracking-wide">
          {monthDayYear.replace(',', '')}
        </p>
        <h2 className={`font-bold text-base ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
          {weekDay}
        </h2>
      </div>
      <div className="flex-grow space-y-1 overflow-y-auto pr-2 -mr-2">
        {todos.map(todo => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onUpdate={onUpdateTodo}
            onDelete={onDeleteTodo}
          />
        ))}
        {Array.from({ length: placeholderCount }).map((_, index) => {
          if (activeIndex === index) {
            return (
              <div key={`input-${index}`} className="h-8">
                <input
                  ref={inputRef}
                  type="text"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  onBlur={handleAddTodo}
                  onKeyDown={handleKeyDown}
                  className="w-full h-full bg-transparent border-none focus:ring-0 p-1 text-sm text-gray-700"
                />
              </div>
            );
          }
          return (
            <div
              key={`placeholder-${index}`}
              className="h-8 border-b border-gray-200/80 cursor-text"
              onClick={() => setActiveIndex(index)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DayColumn;