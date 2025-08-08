'use client';

import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import calendar styles

interface Transaction {
  id: number;
  createdAt: string;
  type: string;
  amount: number;
  category: string;
  description: string | null;
}

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Form state
  const [type, setType] = useState('EXPENSE');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/transactions');
      if (!res.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, amount, category, description }),
      });

      if (!res.ok) {
        throw new Error('Failed to add transaction');
      }

      // Reset form and refetch transactions
      setType('EXPENSE');
      setAmount('');
      setCategory('');
      setDescription('');
      fetchTransactions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const res = await fetch(`/api/transactions?id=${id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          throw new Error('Failed to delete transaction');
        }

        fetchTransactions(); // Refetch transactions to update the list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.createdAt);
    return transactionDate.getFullYear() === selectedDate.getFullYear() &&
           transactionDate.getMonth() === selectedDate.getMonth() &&
           transactionDate.getDate() === selectedDate.getDate();
  });

  return (
    <div>
      <div className="row">
        <div className="col-md-4">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
          />
        </div>
        <div className="col-md-8">
          <h1>Add New Transaction</h1>
          <form onSubmit={handleSubmit} className="card p-3 my-4">
            <div className="row g-3 align-items-center">
              <div className="col-md-2">
                <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                </select>
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-primary w-100">Add</button>
              </div>
            </div>
          </form>

          {error && <p className="text-danger">Error: {error}</p>}

          <h1>Transactions for {selectedDate.toLocaleDateString()}</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${t.type === 'INCOME' ? 'bg-success' : 'bg-danger'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td>{t.amount.toLocaleString()}원</td>
                    <td>{t.category}</td>
                    <td>{t.description}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
