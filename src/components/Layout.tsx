import { Outlet } from 'react-router';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-3 text-center text-xs text-slate-500">
        <span>© PlayLab</span>
      </footer>
    </div>
  );
}
