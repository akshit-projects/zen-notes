import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);
  
  const handleToggleComplete = () => {
    onUpdate({ ...todo, completed: !todo.completed });
  };

  const handleEdit = () => {
    if(!todo.completed){
        setIsEditing(true);
    }
  };

  const handleBlur = () => {
    if (editText.trim()) {
      onUpdate({ ...todo, text: editText.trim() });
    } else {
      onDelete(todo.id);
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };
  
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('todoId', todo.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div 
        className="group relative text-sm font-medium cursor-grab"
        draggable={true}
        onDragStart={handleDragStart}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full bg-gray-100 p-1.5 rounded-sm border-none b-1 focus:ring-blue-500"
        />
      ) : (
        <p
          onClick={handleToggleComplete}
          onDoubleClick={handleEdit}
          className={`cursor-pointer rounded-sm px-1.5 py-1 border-b transition-colors hover:bg-blue-50/50 ${
              todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
          }`}
        >
          {todo.text}
        </p>
      )}
    </div>
  );
};

export default TodoItem;