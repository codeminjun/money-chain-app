'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface Summary {
  income: number;
  expense: number;
  netIncome: number;
  expenseByCategory: Record<string, number>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

const Dashboard = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch('/api/summary');
        if (!res.ok) {
          throw new Error('Failed to fetch summary');
        }
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!summary) return <p>No data available.</p>;

  const pieData = Object.entries(summary.expenseByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="row my-4">
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-header">Total Income</div>
            <div className="card-body">
              <h5 className="card-title">{summary.income.toLocaleString()}원</h5>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-danger mb-3">
            <div className="card-header">Total Expense</div>
            <div className="card-body">
              <h5 className="card-title">{summary.expense.toLocaleString()}원</h5>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-info mb-3">
            <div className="card-header">Net Income</div>
            <div className="card-body">
              <h5 className="card-title">{summary.netIncome.toLocaleString()}원</h5>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">Expense by Category</div>
            <div className="card-body d-flex justify-content-center">
              <PieChart width={400} height={400}>
                <Pie
                  data={pieData}
                  cx={200}
                  cy={200}
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
