'use client';

import Calendar from 'react-calendar';
import '../app/transactions/calendar.css';

interface Transaction {
  id: number;
  createdAt: string;
  type: string;
  amount: number;
  category: string;
  description: string | null;
}

interface TransactionCalendarProps {
  transactions: Transaction[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const TransactionCalendar = ({ transactions, selectedDate, onDateChange }: TransactionCalendarProps) => {

  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayTransactions = transactions.filter(t => new Date(t.createdAt).toDateString() === date.toDateString());
      const hasIncome = dayTransactions.some(t => t.type === 'INCOME');
      const hasExpense = dayTransactions.some(t => t.type === 'EXPENSE');

      const classNames = [];
      if (hasIncome) classNames.push('income-day');
      if (hasExpense) classNames.push('expense-day');

      return classNames.join(' ');
    }
    return null;
  };

  return (
    <Calendar
      onChange={(value) => onDateChange(value as Date)}
      value={selectedDate}
      tileClassName={getTileClassName}
    />
  );
};

export default TransactionCalendar;