
import {
  collection,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { Transaction, Category, Budget, TransactionType } from '../types';

// --- 交易管理 ---
export const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'> & { date: Date }) => {
  return addDoc(collection(db, 'transactions'), {
    ...transaction,
    date: Timestamp.fromDate(transaction.date),
  });
};

// --- 分类管理 ---
const defaultCategories: Omit<Category, 'id'>[] = [
    { name: '餐饮', icon: 'FoodIcon', type: TransactionType.EXPENSE },
    { name: '交通', icon: 'TransportIcon', type: TransactionType.EXPENSE },
    { name: '购物', icon: 'ShoppingIcon', type: TransactionType.EXPENSE },
    { name: '娱乐', icon: 'EntertainmentIcon', type: TransactionType.EXPENSE },
    { name: '住房', icon: 'HousingIcon', type: TransactionType.EXPENSE },
    { name: '医疗', icon: 'HealthIcon', type: TransactionType.EXPENSE },
    { name: '工资', icon: 'IncomeIcon', type: TransactionType.INCOME },
    { name: '理财', icon: 'InvestmentIcon', type: TransactionType.INCOME },
];

export const initializeDefaultCategories = async () => {
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    if (snapshot.empty) {
        const batch = writeBatch(db);
        defaultCategories.forEach(category => {
            const docRef = doc(categoriesRef);
            batch.set(docRef, category);
        });
        await batch.commit();
        console.log("已初始化默认分类。");
    }
};


export const addCategory = (category: Omit<Category, 'id'>) => {
  return addDoc(collection(db, 'categories'), category);
};

export const updateCategory = (id: string, category: Partial<Omit<Category, 'id'>>) => {
  return updateDoc(doc(db, 'categories', id), category);
};

export const deleteCategory = (id: string) => {
  return deleteDoc(doc(db, 'categories', id));
};

// --- 预算管理 ---
export const setBudget = (budget: Omit<Budget, 'id'>) => {
  const budgetId = `${budget.year}-${budget.month}-${budget.categoryId}`;
  return setDoc(doc(db, 'budgets', budgetId), budget);
};
