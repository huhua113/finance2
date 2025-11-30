
import React, { useMemo } from 'react';
import { Transaction, TransactionType } from '../types';

interface MonthlySummaryProps {
  transactions: Transaction[];
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ transactions }) => {
  const { income, expense, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(tx => {
      if (tx.type === TransactionType.INCOME) {
        income += tx.amount;
      } else {
        expense += tx.amount;
      }
    });
    return { income, expense, balance: income - expense };
  }, [transactions]);

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <p className="text-sm text-slate-500">总收入</p>
        <p className="text-lg font-semibold text-emerald-500">¥{income.toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <p className="text-sm text-slate-500">总支出</p>
        <p className="text-lg font-semibold text-rose-500">¥{expense.toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <p className="text-sm text-slate-500">结余</p>
        <p className={`text-lg font-semibold ${balance >= 0 ? 'text-slate-800' : 'text-rose-500'}`}>
          ¥{balance.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default MonthlySummary;
