import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import classes from './List.module.css';

interface Props {
  color: string;
  title: string;
}

export default function List({ color, title }: Props) {
  return (
    <div className={classes['list']}>
      <h3 style={{ borderColor: color }}>{title}</h3>
      <button>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
}
