
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface HeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentDate, onPrevMonth, onNextMonth }) => {
  const formattedDate = `${currentDate.getFullYear()}年 ${currentDate.getMonth() + 1}月`;

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg mb-4">
      <button onClick={onPrevMonth} className="p-2 rounded-full hover:bg-indigo-100 focus:outline-none transition-colors">
        <ChevronLeftIcon className="w-6 h-6 text-slate-600" />
      </button>
      <h1 className="text-xl font-bold text-indigo-700">{formattedDate}</h1>
      <button onClick={onNextMonth} className="p-2 rounded-full hover:bg-indigo-100 focus:outline-none transition-colors">
        <ChevronRightIcon className="w-6 h-6 text-slate-600" />
      </button>
    </header>
  );
};

export default Header;
