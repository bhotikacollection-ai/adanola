import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import SearchPanel from './SearchPanel';
import Footer from './Footer';
import ChatWidget from './ChatWidget';
import Toast from './Toast';
import { useCart } from '../context/CartContext';

function CartToast() {
  const { toast, clearToast } = useCart();
  return <Toast message={toast} onClose={clearToast} />;
}

export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <AnnouncementBar />
      <Navbar onOpenSearch={() => setSearchOpen((v) => !v)} />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <main className="page">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
      <CartToast />
    </>
  );
}
