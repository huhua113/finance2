
export enum TransactionType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

export interface Category {
  id: string;
  name: string;
  icon: string; // 可以是图标组件的名称或SVG字符串
  type: TransactionType; // 支出或收入类别
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: Date;
  categoryId: string;
}

export interface Budget {
    id: string; // format: YYYY-MM-categoryId
    year: number;
    month: number;
    categoryId: string;
    amount: number;
}
