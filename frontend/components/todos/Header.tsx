import React from 'react';

interface HeaderProps {
  onPrevMonth: () => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onNextMonth: () => void;
}

const NavButton: React.FC<{onClick: () => void, children: React.ReactNode, 'aria-label': string}> = ({ onClick, children, 'aria-label': ariaLabel }) => (
    <button onClick={onClick} aria-label={ariaLabel} className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
        {children}
    </button>
);

const Header: React.FC<HeaderProps> = ({ onPrevMonth, onPrevWeek, onNextWeek, onNextMonth }) => {
  return (
    <header className="flex-shrink-0 bg-white px-4 py-2 flex items-center justify-between z-10">
      <div className="w-1/3">
        {/* Intentionally left blank for alignment */}
      </div>
      <div className="w-1/3 text-center">
        <h1 className="text-lg font-bold text-gray-800 tracking-widest uppercase select-none">TEUXDEUX</h1>
      </div>
      <div className="w-1/3 flex items-center justify-end space-x-1">
        <NavButton onClick={onPrevMonth} aria-label="Previous month">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </NavButton>
        <NavButton onClick={onPrevWeek} aria-label="Previous week">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </NavButton>
        <NavButton onClick={onNextWeek} aria-label="Next week">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </NavButton>
        <NavButton onClick={onNextMonth} aria-label="Next month">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </NavButton>
         <NavButton onClick={() => {}} aria-label="Print view">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
             <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
           </svg>
        </NavButton>
      </div>
    </header>
  );
};

export default Header;
