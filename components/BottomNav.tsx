
import React from 'react';
import { HomeIcon, ChartPieIcon, CogIcon } from './Icons';

type View = 'home' | 'reports' | 'budgets';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { view: 'home', icon: HomeIcon, label: '明细' },
    { view: 'reports', icon: ChartPieIcon, label: '报告' },
    { view: 'budgets', icon: CogIcon, label: '预算' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-slate-200">
      <div className="flex justify-around">
        {navItems.map(item => (
          <button
            key={item.view}
            onClick={() => setActiveView(item.view as View)}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-sm transition-colors duration-200 ${
              activeView === item.view 
              ? 'text-indigo-600 border-t-2 border-indigo-600 bg-indigo-50' 
              : 'text-slate-500 border-t-2 border-transparent'
            }`}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
