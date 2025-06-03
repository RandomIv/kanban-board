import Link from 'next/link';
import classes from './MainHeader.module.css';

export default function MainHeader() {
  return (
    <div className={classes['main-header']}>
      <div className={classes['header-box']}>
        <Link href="/">
          <h1>Kanban App 📋</h1>
        </Link>
      </div>
      <div className={classes['btn-container']}>
        <Link href="/">Sign up</Link>
        <Link href="/">Log in</Link>
      </div>
    </div>
  );
}
