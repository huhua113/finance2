
import React, { useState } from 'react';
import { Transaction, TransactionType, Category } from '../types';
import { iconMap } from './Icons';

interface AddTransactionModalProps {
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'> & { date: Date }) => void;
  categories: Category[];
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ onClose, onAddTransaction, categories }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredCategories = categories.filter(c => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !categoryId || !date) {
      alert('请填写所有字段');
      return;
    }
    onAddTransaction({
      amount: parseFloat(amount),
      description,
      categoryId,
      type,
      date: new Date(date),
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-slate-800">添加一笔记录</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button type="button" onClick={() => setType(TransactionType.EXPENSE)} className={`w-1/2 p-2 font-semibold transition-colors ${type === TransactionType.EXPENSE ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-700'}`}>支出</button>
              <button type="button" onClick={() => setType(TransactionType.INCOME)} className={`w-1/2 p-2 font-semibold transition-colors ${type === TransactionType.INCOME ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700'}`}>收入</button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700">金额</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div className="mb-4">
             <label className="block text-sm font-medium text-slate-700">分类</label>
             <div className="grid grid-cols-4 gap-2 mt-2">
                {filteredCategories.map(cat => {
                    const Icon = iconMap[cat.icon];
                    return (
                        <button type="button" key={cat.id} onClick={() => setCategoryId(cat.id)} className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-colors ${categoryId === cat.id ? 'border-indigo-500 bg-indigo-50' : 'border-transparent bg-slate-100 hover:bg-slate-200'}`}>
                           {Icon && <Icon className="w-6 h-6 mb-1 text-slate-700"/>}
                           <span className="text-xs text-slate-700">{cat.name}</span>
                        </button>
                    )
                })}
             </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700">描述</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
           <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700">日期</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">取消</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">保存</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
