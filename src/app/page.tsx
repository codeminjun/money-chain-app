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

        // Handle new API response structure
        setSummary(summaryData.data?.summary || summaryData);
        setTransactions(transactionsData.data || transactionsData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        <div className="spinner-border text-warning mb-3" role="status" style={{ color: 'var(--accent-gold) !important' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="premium-text" style={{ color: 'var(--foreground)', fontSize: '1.1rem' }}>
          Preparing your wealth overview...
        </p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="luxury-card p-5 text-center" style={{ maxWidth: '400px' }}>
        <h5 className="premium-text mb-3" style={{ color: 'var(--danger)' }}>
          Unable to Load Data
        </h5>
        <p className="mb-0" style={{ color: 'rgba(26, 26, 26, 0.7)' }}>
          {error}
        </p>
      </div>
    </div>
  );
  
  if (!summary) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="luxury-card p-5 text-center" style={{ maxWidth: '400px' }}>
        <h5 className="premium-text mb-3" style={{ color: 'var(--warning)' }}>
          No Financial Data Available
        </h5>
        <p className="mb-0" style={{ color: 'rgba(26, 26, 26, 0.7)' }}>
          Start tracking your wealth by adding transactions.
        </p>
      </div>
    </div>
  );

  return (
    <div className="luxury-dashboard">
      <div className="mb-5">
        <h1 className="gradient-text" style={{ 
          fontFamily: 'var(--font-playfair)', 
          fontSize: '3rem',
          fontWeight: '700',
          marginBottom: '0.5rem'
        }}>
          Wealth Overview
        </h1>
        <p className="premium-text" style={{ 
          color: 'rgba(26, 26, 26, 0.7)', 
          fontSize: '1.1rem',
          marginBottom: '0'
        }}>
          Your comprehensive financial dashboard
        </p>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="luxury-card p-4 h-100 position-relative overflow-hidden">
                <div className="position-absolute top-0 end-0 p-3">
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'var(--gradient-gold)', 
                    borderRadius: '50%',
                    opacity: '0.1'
                  }}></div>
                </div>
                <div className="mb-3">
                  <h6 className="premium-text" style={{ 
                    color: 'var(--success)', 
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.5rem'
                  }}>
                    Total Income
                  </h6>
                  <h3 className="gradient-text mb-0" style={{ 
                    fontSize: '2.2rem',
                    fontWeight: '700'
                  }}>
                    ₩{summary.income.toLocaleString()}
                  </h3>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="luxury-card p-4 h-100 position-relative overflow-hidden">
                <div className="position-absolute top-0 end-0 p-3">
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'var(--danger)', 
                    borderRadius: '50%',
                    opacity: '0.1'
                  }}></div>
                </div>
                <div className="mb-3">
                  <h6 className="premium-text" style={{ 
                    color: 'var(--danger)', 
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.5rem'
                  }}>
                    Total Expenses
                  </h6>
                  <h3 className="mb-0" style={{ 
                    fontSize: '2.2rem',
                    fontWeight: '700',
                    color: 'var(--foreground)'
                  }}>
                    ₩{summary.expense.toLocaleString()}
                  </h3>
                </div>
              </div>
            </div>
            
            <div className="col-12">
              <div className="luxury-card p-4 position-relative overflow-hidden">
                <div className="position-absolute top-0 end-0 p-3">
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    background: 'var(--gradient-gold)', 
                    borderRadius: '50%',
                    opacity: '0.1'
                  }}></div>
                </div>
                <div className="mb-3">
                  <h6 className="premium-text" style={{ 
                    color: 'var(--accent-gold)', 
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.5rem'
                  }}>
                    Net Worth
                  </h6>
                  <h2 className="gradient-text mb-0" style={{ 
                    fontSize: '3rem',
                    fontWeight: '700',
                    fontFamily: 'var(--font-playfair)'
                  }}>
                    ₩{summary.netIncome.toLocaleString()}
                  </h2>
                  <p className="premium-text mb-0" style={{ 
                    color: 'rgba(26, 26, 26, 0.6)', 
                    fontSize: '0.9rem',
                    marginTop: '0.5rem'
                  }}>
                    Current portfolio balance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="luxury-card p-4 h-100">
            <h5 className="premium-text mb-4" style={{ 
              color: 'var(--foreground)',
              fontSize: '1.1rem'
            }}>
              Transaction Calendar
            </h5>
            <TransactionCalendar 
              transactions={transactions}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
