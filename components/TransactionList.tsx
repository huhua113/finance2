
import React, { useMemo } from 'react';
import { Transaction, TransactionType, Category } from '../types';
import { iconMap } from './Icons';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, categories }) => {
  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach(cat => map.set(cat.id, cat));
    return map;
  }, [categories]);

  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};
    transactions.forEach(tx => {
        if (tx.date instanceof Date) {
            const dateStr = tx.date.toISOString().split('T')[0];
            if (!groups[dateStr]) {
                groups[dateStr] = [];
            }
            groups[dateStr].push(tx);
        }
    });
    return groups;
  }, [transactions]);

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a));
  
  if (transactions.length === 0) {
      return <div className="text-center text-slate-500 mt-8">本月没有交易记录</div>
  }

  return (
    <div className="space-y-4">
      {sortedDates.map(date => (
        <div key={date}>
          <h2 className="text-sm font-semibold text-slate-500 mb-2 px-2">{date}</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {groupedTransactions[date].map(tx => {
              const category = categoryMap.get(tx.categoryId);
              const IconComponent = category ? iconMap[category.icon] : null;
              return (
                <div key={tx.id} className="flex items-center p-3 border-b last:border-b-0 hover:bg-slate-50 transition-colors duration-150">
                  {IconComponent && (
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <IconComponent className="w-6 h-6 text-indigo-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{tx.description}</p>
                    <p className="text-xs text-slate-500">{category?.name || '未分类'}</p>
                  </div>
                  <p className={`font-semibold ${tx.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {tx.type === TransactionType.INCOME ? '+' : '-'}¥{tx.amount.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
