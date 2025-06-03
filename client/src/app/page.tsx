import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import classes from './page.module.css';

export default function Home() {
  return (
    <div className="container">
      <h1 className={classes['home-header']}>Create your first kanban!</h1>
      <div className={classes['link-box']}>
        <Link href="/board" className={classes['add-btn']}>
          <FontAwesomeIcon icon={faPlus} />
        </Link>
      </div>
    </div>
  );
}
