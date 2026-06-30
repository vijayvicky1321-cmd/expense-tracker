import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Expenses } from './pages/Expenses';
import { Reports } from './pages/Reports';
import { Analytics } from './pages/Analytics';
import { useExpenseStore } from './store/useExpenseStore';
import { seedExpenses } from './data/seedData';

function App() {
  const expenses = useExpenseStore((s) => s.expenses);
  const importExpenses = useExpenseStore((s) => s.importExpenses);

  // Seed demo data only when store is empty
  useEffect(() => {
    if (expenses.length === 0) {
      importExpenses(seedExpenses);
    }
  }, []);

  return (
    <BrowserRouter basename="/expense-tracker">
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="reports" element={<Reports />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
