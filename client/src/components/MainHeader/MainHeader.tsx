'use client';
import Link from 'next/link';
import classes from './MainHeader.module.css';

export default function MainHeader() {
  const handleLogin = () => {
    localStorage.setItem(
      'token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZjBlMzRmZS03MDA4LTQwZDgtOWQ5ZC04MzU5Y2RjNmYyODEiLCJpYXQiOjE3NDkxMTU3OTgsImV4cCI6MTc1MTcwNzc5OH0.WtEN6f5AR0NvmAsxr3JwkGWxHvSiiQU1ReBLCtp8JUw'
    );
  };

  return (
    <div className={classes['main-header']}>
      <div className={classes['header-box']}>
        <Link href="/">
          <h1>Kanban App 📋</h1>
        </Link>
      </div>
      <div className={classes['btn-container']}>
        <Link href="/">Sign up</Link>
        {/* <Link href="/">Log in</Link> */}
        <button onClick={handleLogin}>Log in</button>
      </div>
    </div>
  );
}
