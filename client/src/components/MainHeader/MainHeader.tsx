'use client';
import Link from 'next/link';
import classes from './MainHeader.module.css';
import { useEffect, useState } from 'react';

export default function MainHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };
  return (
    <div className={classes['main-header']}>
      <div className={classes['header-box']}>
        <Link href="/">
          <h1>Kanban App 📋</h1>
        </Link>
      </div>
      <div className={classes['btn-container']}>
        {isLoggedIn ? (
          <button onClick={handleLogout} className={classes['logout-btn']}>
            Logout
          </button>
        ) : (
          <>
            <Link href="/register">Sign up</Link>
            <Link href="/login">Log in</Link>
          </>
        )}
      </div>
    </div>
  );
}
