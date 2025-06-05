import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import classes from './BoardItem.module.css';

interface Props {
  id: string;
  title: string;
  updatedAt: string;
}

export default function BoardItem({ id, title, updatedAt }: Props) {
  const date = new Date(updatedAt);
  const formattedDate = date.toLocaleDateString();

  return (
    <Link href={`/board/${id}`}>
      <div className={classes['board-item']}>
        <h3>{title}</h3>
        <div className={classes['date-box']}>
          <span>{formattedDate}</span>
          <button>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </Link>
  );
}
