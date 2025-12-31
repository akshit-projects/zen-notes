import React, { useState, useMemo } from 'react';
import Header from './Header';
import DayColumn from './DayColumn';
import BottomLists from './BottomLists';
import useTodos from '../../hooks/todos/useTodos';
import { getWeekDates, formatDate } from '../../utils/date';
import { Todo, DropLocation } from '../../types';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { todos, addTodo, updateTodo, deleteTodo } = useTodos();

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);

  const handleTodoDrop = (todoId: string, newLocation: DropLocation) => {
    const todoToMove = todos.find(t => t.id === todoId);
    if (todoToMove && (todoToMove.date !== newLocation.date || todoToMove.list !== newLocation.list)) {
      updateTodo({
        ...todoToMove,
        date: newLocation.date,
        list: newLocation.list,
      });
    }
  };


  const goToPreviousWeek = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  const goToNextWeek = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const { groupedByDate, groupedByList } = useMemo(() => {
    const groupedByDate: { [key: string]: Todo[] } = {};
    const groupedByList: { [key: string]: Todo[] } = {};

    todos.forEach(todo => {
      if (todo.date) {
        if (!groupedByDate[todo.date]) {
          groupedByDate[todo.date] = [];
        }
        groupedByDate[todo.date].push(todo);
      } else if (todo.list) {
        if (!groupedByList[todo.list]) {
          groupedByList[todo.list] = [];
        }
        groupedByList[todo.list].push(todo);
      }
    });
    return { groupedByDate, groupedByList };
  }, [todos]);

  return (
    <div className="flex flex-col h-screen font-sans antialiased bg-white">
      <Header 
        onPrevMonth={goToPreviousMonth}
        onPrevWeek={goToPreviousWeek}
        onNextWeek={goToNextWeek}
        onNextMonth={goToNextMonth}
      />
      <main className="flex-grow flex flex-col overflow-hidden">
        {/* Week View */}
        <div className="h-[65vh] flex-shrink-0 flex border-b border-gray-200">
          <div className="flex flex-1 overflow-x-auto h-full">
            {weekDates.map(date => {
              const dateString = formatDate(date);
              return (
                <DayColumn
                  key={dateString}
                  date={date}
                  todos={groupedByDate[dateString] || []}
                  onAddTodo={(text) => addTodo(text, dateString, undefined)}
                  onUpdateTodo={updateTodo}
                  onDeleteTodo={deleteTodo}
                  onTodoDrop={handleTodoDrop}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom Lists View */}
        <div className="flex-grow overflow-y-auto">
          <BottomLists
            listTodos={groupedByList}
            addTodo={addTodo}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            onTodoDrop={handleTodoDrop}
          />
        </div>
      </main>
    </div>
  );
};

export default App;