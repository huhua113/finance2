
import React, { useState, useEffect, useMemo } from 'react';
import { onSnapshot, collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './services/firebase';
import { addTransaction, initializeDefaultCategories } from './services/firestoreService';
import { Transaction, Category, Budget } from './types';
import Header from './components/Header';
import MonthlySummary from './components/MonthlySummary';
import TransactionList from './components/TransactionList';
import Reports from './components/Reports';
import Budgets from './components/Budgets';
import AddTransactionModal from './components/AddTransactionModal';
import FloatingActionButton from './components/FloatingActionButton';
import BottomNav from './components/BottomNav';
import { PlusIcon } from './components/Icons';

type View = 'home' | 'reports' | 'budgets';

const App: React.FC = () => {
  // --- State Management ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('home');

  // --- Data Fetching ---
  useEffect(() => {
    // 初始化默认分类（如果不存在）
    initializeDefaultCategories();

    const collections = {
      transactions: query(collection(db, "transactions"), orderBy("date", "desc")),
      categories: collection(db, "categories"),
      budgets: collection(db, "budgets")
    };

    const unsubscribers = [
      onSnapshot(collections.transactions, snapshot => {
        setTransactions(snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(), 
            date: (doc.data().date as Timestamp).toDate() 
        } as Transaction)));
        setLoading(false);
      }, handleError),
      onSnapshot(collections.categories, snapshot => {
        setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
      }, handleError),
      onSnapshot(collections.budgets, snapshot => {
        setBudgets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Budget)));
      }, handleError),
    ];

    function handleError(err: Error) {
        console.error("获取数据时出错: ", err);
        setError("无法加载数据，请检查您的Firebase设置和网络连接。");
        setLoading(false);
    }

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  // --- Memoized Calculations ---
  const monthlyTransactions = useMemo(() => {
    return transactions.filter(tx =>
      tx.date instanceof Date &&
      tx.date.getFullYear() === currentDate.getFullYear() &&
      tx.date.getMonth() === currentDate.getMonth()
    );
  }, [transactions, currentDate]);

  const monthlyBudgets = useMemo(() => {
    return budgets.filter(b => 
        b.year === currentDate.getFullYear() && b.month === currentDate.getMonth() + 1
    );
  }, [budgets, currentDate]);
  
  // --- Event Handlers ---
  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + (direction === 'prev' ? -1 : 1), 1));
  };
  
  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'|'date'> & { date: Date }) => {
    try {
      await addTransaction(transaction);
      setIsModalOpen(false);
    } catch (e) {
      console.error("添加交易失败: ", e);
      alert("添加失败，请稍后再试。");
    }
  };

  // --- Render Logic ---
  const renderContent = () => {
    if (loading) return <div className="text-center mt-10 text-slate-500">加载中...</div>;
    if (error) return <div className="text-center mt-10 text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;

    switch (activeView) {
      case 'reports':
        return <Reports transactions={transactions} categories={categories} />;
      case 'budgets':
        return <Budgets categories={categories} budgets={monthlyBudgets} transactions={monthlyTransactions} currentDate={currentDate} />;
      case 'home':
      default:
        return (
          <>
            <MonthlySummary transactions={monthlyTransactions} />
            <TransactionList transactions={monthlyTransactions} categories={categories} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="container mx-auto max-w-lg p-4 pb-24">
        <Header 
          currentDate={currentDate} 
          onPrevMonth={() => handleMonthChange('prev')} 
          onNextMonth={() => handleMonthChange('next')} 
        />
        {renderContent()}
      </div>

      {activeView === 'home' && (
        <FloatingActionButton onClick={() => setIsModalOpen(true)}>
          <PlusIcon className="w-8 h-8" />
        </FloatingActionButton>
      )}

      {isModalOpen && (
        <AddTransactionModal 
          onClose={() => setIsModalOpen(false)}
          onAddTransaction={handleAddTransaction}
          categories={categories}
        />
      )}
      
      <BottomNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default App;
