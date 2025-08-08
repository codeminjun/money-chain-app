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
        body: JSON.stringify({ type, amount, category, description, createdAt: selectedDate }),
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
    <div className="luxury-transactions">
      <div className="mb-5">
        <h1 className="gradient-text" style={{ 
          fontFamily: 'var(--font-playfair)', 
          fontSize: '2.8rem',
          fontWeight: '700',
          marginBottom: '0.5rem'
        }}>
          Transaction Management
        </h1>
        <p className="premium-text" style={{ 
          color: 'rgba(26, 26, 26, 0.7)', 
          fontSize: '1.1rem'
        }}>
          Track and manage your financial activities with precision
        </p>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="luxury-card p-4">
            <h5 className="premium-text mb-4" style={{ color: 'var(--foreground)' }}>
              Calendar View
            </h5>
            <TransactionCalendar 
              transactions={transactions}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>
        </div>
        
        <div className="col-lg-8">
          <div className="luxury-card p-4 mb-4">
            <h5 className="premium-text mb-4" style={{ color: 'var(--foreground)' }}>
              Add New Transaction
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6 col-lg-2">
                  <label className="form-label premium-text" style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>
                    Type
                  </label>
                  <select 
                    className="form-select" 
                    value={type} 
                    onChange={(e) => setType(e.target.value)}
                    style={{ 
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: 'var(--border-radius-md)',
                      padding: '0.75rem'
                    }}
                  >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                </div>
                <div className="col-md-6 col-lg-3">
                  <label className="form-label premium-text" style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>
                    Amount (₩)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    style={{ 
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: 'var(--border-radius-md)',
                      padding: '0.75rem'
                    }}
                  />
                </div>
                <div className="col-md-6 col-lg-3">
                  <label className="form-label premium-text" style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>
                    Category
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Food, Transport"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    style={{ 
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: 'var(--border-radius-md)',
                      padding: '0.75rem'
                    }}
                  />
                </div>
                <div className="col-md-6 col-lg-4">
                  <label className="form-label premium-text" style={{ fontSize: '0.9rem', color: 'var(--foreground)' }}>
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Optional details"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ 
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: 'var(--border-radius-md)',
                      padding: '0.75rem'
                    }}
                  />
                </div>
                <div className="col-12">
                  <button 
                    type="submit" 
                    className="btn"
                    style={{
                      background: 'var(--gradient-gold)',
                      border: 'none',
                      borderRadius: 'var(--border-radius-md)',
                      padding: '0.75rem 2rem',
                      color: '#000',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Add Transaction
                  </button>
                </div>
              </div>
            </form>
          </div>

          {error && (
            <div className="luxury-card p-4 mb-4" style={{ borderLeft: '4px solid var(--danger)' }}>
              <h6 className="premium-text" style={{ color: 'var(--danger)' }}>Error</h6>
              <p className="mb-0" style={{ color: 'rgba(26, 26, 26, 0.7)' }}>{error}</p>
            </div>
          )}

          <div className="luxury-card p-4">
            <h5 className="premium-text mb-4" style={{ color: 'var(--foreground)' }}>
              Transactions for {selectedDate.toLocaleDateString()}
            </h5>
            
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" style={{ color: 'var(--accent-gold)' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="premium-text mt-3" style={{ color: 'var(--foreground)' }}>
                  Loading transactions...
                </p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-5">
                <p className="premium-text" style={{ color: 'rgba(26, 26, 26, 0.5)', fontSize: '1.1rem' }}>
                  No transactions found for this date
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table" style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid rgba(0, 0, 0, 0.1)' }}>
                      <th className="premium-text" style={{ padding: '1rem 0.5rem', color: 'var(--foreground)' }}>Date</th>
                      <th className="premium-text" style={{ padding: '1rem 0.5rem', color: 'var(--foreground)' }}>Type</th>
                      <th className="premium-text" style={{ padding: '1rem 0.5rem', color: 'var(--foreground)' }}>Amount</th>
                      <th className="premium-text" style={{ padding: '1rem 0.5rem', color: 'var(--foreground)' }}>Category</th>
                      <th className="premium-text" style={{ padding: '1rem 0.5rem', color: 'var(--foreground)' }}>Description</th>
                      <th className="premium-text" style={{ padding: '1rem 0.5rem', color: 'var(--foreground)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((t) => (
                      <tr key={t.id} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                        <td style={{ padding: '1rem 0.5rem', color: 'rgba(26, 26, 26, 0.8)' }}>
                          {new Date(t.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <span 
                            className="badge"
                            style={{
                              background: t.type === 'INCOME' ? 'var(--success)' : 'var(--danger)',
                              color: 'white',
                              padding: '0.4rem 0.8rem',
                              borderRadius: 'var(--border-radius-sm)',
                              fontSize: '0.8rem',
                              fontWeight: '500'
                            }}
                          >
                            {t.type}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.5rem', color: 'rgba(26, 26, 26, 0.8)', fontWeight: '600' }}>
                          ₩{t.amount.toLocaleString()}
                        </td>
                        <td style={{ padding: '1rem 0.5rem', color: 'rgba(26, 26, 26, 0.8)' }}>
                          {t.category}
                        </td>
                        <td style={{ padding: '1rem 0.5rem', color: 'rgba(26, 26, 26, 0.6)' }}>
                          {t.description || '-'}
                        </td>
                        <td style={{ padding: '1rem 0.5rem' }}>
                          <button 
                            className="btn btn-sm"
                            onClick={() => handleDelete(t.id)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: 'var(--danger)',
                              borderRadius: 'var(--border-radius-sm)',
                              padding: '0.4rem 0.8rem',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
