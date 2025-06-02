import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import classes from './CardItem.module.css';

interface Props {
  color?: string;
}

export default function CardItem({ color }: Props) {
  return (
    <div className={classes['card-box']} style={{ borderColor: color }}>
      <div className={classes['card-header']}>
        <input type="text" />
        <button className={classes['card-box']}>
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </button>
      </div>
    </div>
  );
}
