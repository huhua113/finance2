
import React from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-5 z-50 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
      aria-label="添加新交易"
    >
      {children}
    </button>
  );
};

export default FloatingActionButton;
