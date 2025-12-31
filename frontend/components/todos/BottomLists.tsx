import React from 'react';
import { Todo, DropLocation } from '../../types';
import CustomList from './CustomList';

interface BottomListsProps {
  listTodos: { [key: string]: Todo[] };
  addTodo: (text: string, date: string | null, list?: string) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  onTodoDrop: (todoId: string, newLocation: DropLocation) => void;
}

const LIST_ORDER = ["INBOX", "THIS WEEK", "NEXT WEEK", "THIS MONTH", "NEXT MONTH", "LONG TERM"];

const BottomLists: React.FC<BottomListsProps> = ({ listTodos, addTodo, updateTodo, deleteTodo, onTodoDrop }) => {

  return (
    <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-8">
        {LIST_ORDER.map(listName => (
          <CustomList
            key={listName}
            title={listName}
            todos={listTodos[listName] || []}
            onAddTodo={(text) => addTodo(text, null, listName)}
            onUpdateTodo={updateTodo}
            onDeleteTodo={deleteTodo}
            onTodoDrop={onTodoDrop}
          />
        ))}
        <div>
          <button className="text-sm font-bold text-gray-400 hover:text-gray-800 transition-colors uppercase tracking-wider">
            + New List
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomLists;