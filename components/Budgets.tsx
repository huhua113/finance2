
import React, { useState, useMemo } from 'react';
import { Category, Budget, Transaction, TransactionType } from '../types';
import { setBudget, addCategory, updateCategory, deleteCategory } from '../services/firestoreService';
import { iconMap, FoodIcon, TransportIcon, ShoppingIcon, EntertainmentIcon, HousingIcon, HealthIcon, IncomeIcon, InvestmentIcon } from './Icons';

interface BudgetsProps {
  categories: Category[];
  budgets: Budget[];
  transactions: Transaction[];
  currentDate: Date;
}

const allIcons = { FoodIcon, TransportIcon, ShoppingIcon, EntertainmentIcon, HousingIcon, HealthIcon, IncomeIcon, InvestmentIcon };

const Budgets: React.FC<BudgetsProps> = ({ 
    categories, 
    budgets, 
    transactions, 
    currentDate,
}) => {
  const [activeTab, setActiveTab] = useState('budgets');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const expenseCategories = useMemo(() => categories.filter(c => c.type === TransactionType.EXPENSE), [categories]);
  
  const monthlyExpenses = useMemo(() => {
    const expenses: { [categoryId: string]: number } = {};
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        expenses[t.categoryId] = (expenses[t.categoryId] || 0) + t.amount;
      });
    return expenses;
  }, [transactions]);

  const handleSetBudget = (categoryId: string, amount: number) => {
    setBudget({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      categoryId,
      amount,
    });
  };

  const handleSaveCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory) return;
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const icon = formData.get('icon') as string;
    const type = formData.get('type') as TransactionType;

    if (editingCategory.id === 'new') {
        addCategory({ name, icon, type });
    } else {
        updateCategory(editingCategory.id, { name, icon, type });
    }
    setEditingCategory(null);
  };

  const BudgetManager = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-700">月度预算设置</h2>
      {expenseCategories.map(cat => {
        const budget = budgets.find(b => b.categoryId === cat.id);
        const spent = monthlyExpenses[cat.id] || 0;
        const progress = budget && budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
        return (
          <div key={cat.id} className="bg-white p-3 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-slate-700">{cat.name}</span>
              <div className="flex items-center space-x-2">
                 <span className="text-sm text-slate-500">¥{spent.toFixed(2)} / </span>
                 <input
                    type="number"
                    placeholder="预算"
                    defaultValue={budget?.amount}
                    onBlur={e => handleSetBudget(cat.id, parseFloat(e.target.value) || 0)}
                    className="w-24 p-1 border rounded text-right border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                 />
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${progress > 100 ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                    style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const CategoryManager = () => (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-700">分类管理</h2>
            <button onClick={() => setEditingCategory({id: 'new', name: '', icon: 'FoodIcon', type: TransactionType.EXPENSE})} className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">新增分类</button>
        </div>
        <div className="space-y-2">
            {categories.map(cat => (
                <div key={cat.id} className="bg-white p-3 rounded-lg shadow flex justify-between items-center">
                    <div className="flex items-center">
                        {React.createElement(iconMap[cat.icon] || FoodIcon, { className: 'w-6 h-6 mr-3 text-slate-600' })}
                        <span className="text-slate-800">{cat.name}</span>
                    </div>
                    <div>
                        <button onClick={() => setEditingCategory(cat)} className="text-sm text-indigo-600 hover:underline mr-2">编辑</button>
                        <button onClick={() => window.confirm(`确认删除分类 "${cat.name}"?`) && deleteCategory(cat.id)} className="text-sm text-rose-600 hover:underline">删除</button>
                    </div>
                </div>
            ))}
        </div>

        {editingCategory && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                <form onSubmit={handleSaveCategory} className="bg-white rounded-lg p-5 w-11/12 max-w-sm">
                    <h3 className="text-xl font-bold mb-4 text-slate-800">{editingCategory.id === 'new' ? '新增' : '编辑'}分类</h3>
                    <input type="text" name="name" defaultValue={editingCategory.name} placeholder="分类名称" className="w-full p-2 border border-slate-300 rounded mb-3 focus:ring-indigo-500 focus:border-indigo-500" required />
                    <select name="type" defaultValue={editingCategory.type} className="w-full p-2 border border-slate-300 rounded mb-3 focus:ring-indigo-500 focus:border-indigo-500">
                        <option value={TransactionType.EXPENSE}>支出</option>
                        <option value={TransactionType.INCOME}>收入</option>
                    </select>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">图标</label>
                        <div className="grid grid-cols-5 gap-2">
                            {Object.keys(allIcons).map(iconName => (
                                <label key={iconName} className={`flex justify-center items-center p-2 rounded-lg border-2 cursor-pointer ${editingCategory.icon === iconName ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'}`}>
                                    <input type="radio" name="icon" value={iconName} defaultChecked={editingCategory.icon === iconName} className="hidden" onChange={e => setEditingCategory({...editingCategory, icon: e.target.value})}/>
                                    {React.createElement(allIcons[iconName as keyof typeof allIcons], { className: 'w-6 h-6 text-slate-600'})}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={() => setEditingCategory(null)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded hover:bg-slate-300">取消</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">保存</button>
                    </div>
                </form>
            </div>
        )}
    </div>
  );

  return (
    <div>
      <div className="flex justify-center border-b border-slate-200 mb-4">
        <button onClick={() => setActiveTab('budgets')} className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'budgets' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`}>预算</button>
        <button onClick={() => setActiveTab('categories')} className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'categories' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`}>分类</button>
      </div>
      {activeTab === 'budgets' ? <BudgetManager /> : <CategoryManager />}
    </div>
  );
};

export default Budgets;
