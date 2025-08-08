'use client';

import { useEffect, useState } from 'react';
import TransactionCalendar from '@/components/TransactionCalendar';

interface Transaction {
  id: number;
  createdAt: string;
  type: string;
  amount: number;
  category: string;
  description: string | null;
}

interface Summary {
  income: number;
  expense: number;
  netIncome: number;
}

const Dashboard = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, transactionsRes] = await Promise.all([
          fetch('/api/summary'),
          fetch('/api/transactions')
        ]);

        if (!summaryRes.ok || !transactionsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const summaryData = await summaryRes.json();
        const transactionsData = await transactionsRes.json();

        setSummary(summaryData);
        setTransactions(transactionsData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!summary) return <p>No data available.</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="row my-4">
            <div className="col-md-6">
              <div className="card text-white bg-success mb-3">
                <div className="card-header">Total Income</div>
                <div className="card-body">
                  <h5 className="card-title">{summary.income.toLocaleString()}원</h5>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card text-white bg-danger mb-3">
                <div className="card-header">Total Expense</div>
                <div className="card-body">
                  <h5 className="card-title">{summary.expense.toLocaleString()}원</h5>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="card text-white bg-info mb-3">
                <div className="card-header">Net Income (Current Balance)</div>
                <div className="card-body">
                  <h2 className="card-title fw-bold">{summary.netIncome.toLocaleString()}원</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <TransactionCalendar 
                transactions={transactions}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
