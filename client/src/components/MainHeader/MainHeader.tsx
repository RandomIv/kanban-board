'use client';
import Link from 'next/link';
import classes from './MainHeader.module.css';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function MainHeader() {
  const { isAuthenticated, logout, loadToken } = useAuthStore();

  useEffect(() => {
    loadToken();
  }, []);

  return (
    <div className={classes['main-header']}>
      <div className={classes['header-box']}>
        <Link href="/">
          <h1>Kanban App 📋</h1>
        </Link>
      </div>
      <div className={classes['btn-container']}>
        {isAuthenticated ? (
          <>
            <button onClick={logout}>Logout</button>
          </>
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
