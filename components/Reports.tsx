
import React, { useMemo, useEffect, useRef } from 'react';
import { Transaction, Category, TransactionType } from '../types';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface ReportsProps {
  transactions: Transaction[];
  categories: Category[];
}

const Reports: React.FC<ReportsProps> = ({ transactions, categories }) => {
  const pieChartRef = useRef<HTMLCanvasElement>(null);
  const barChartRef = useRef<HTMLCanvasElement>(null);

  const categoryMap = useMemo(() => new Map(categories.map(c => [c.id, c.name])), [categories]);
  
  const expenseTransactions = useMemo(() => transactions.filter(t => t.type === TransactionType.EXPENSE), [transactions]);

  // Pie Chart Data
  const pieChartData = useMemo(() => {
    const data: { [key: string]: number } = {};
    expenseTransactions.forEach(tx => {
      const categoryName = categoryMap.get(tx.categoryId) || '未分类';
      data[categoryName] = (data[categoryName] || 0) + tx.amount;
    });
    return {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: ['#f43f5e', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#6366f1'],
        hoverOffset: 4,
      }],
    };
  }, [expenseTransactions, categoryMap]);

  // Bar Chart Data (Last 12 months)
  const barChartData = useMemo(() => {
    const monthlyData: { [key: string]: { income: number; expense: number } } = {};
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[key] = { income: 0, expense: 0 };
    }

    transactions.forEach(tx => {
        if(tx.date instanceof Date) {
            const key = `${tx.date.getFullYear()}-${String(tx.date.getMonth() + 1).padStart(2, '0')}`;
            if (monthlyData[key]) {
                if (tx.type === TransactionType.INCOME) {
                    monthlyData[key].income += tx.amount;
                } else {
                    monthlyData[key].expense += tx.amount;
                }
            }
        }
    });

    const labels = Object.keys(monthlyData);
    return {
        labels,
        datasets: [
            { label: '收入', data: labels.map(l => monthlyData[l].income), backgroundColor: '#10b981' },
            { label: '支出', data: labels.map(l => monthlyData[l].expense), backgroundColor: '#f43f5e' },
        ],
    };

  }, [transactions]);
  
  useEffect(() => {
    let pieChartInstance: Chart | null = null;
    let barChartInstance: Chart | null = null;

    if (pieChartRef.current) {
        pieChartInstance = new Chart(pieChartRef.current, { type: 'pie', data: pieChartData });
    }
    if (barChartRef.current) {
        barChartInstance = new Chart(barChartRef.current, { type: 'bar', data: barChartData, options: { responsive: true, scales: { y: { beginAtZero: true } } } });
    }

    return () => {
        pieChartInstance?.destroy();
        barChartInstance?.destroy();
    }
  }, [pieChartData, barChartData]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-slate-700">本月支出分类</h2>
        <canvas ref={pieChartRef}></canvas>
      </div>
       <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-slate-700">近12个月收支趋势</h2>
        <canvas ref={barChartRef}></canvas>
      </div>
    </div>
  );
};

export default Reports;
