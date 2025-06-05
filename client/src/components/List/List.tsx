'use client';

import CardItem from '../CardItem/CardItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import classes from './List.module.css';

import { createNewCard } from '@/utils/cardUtils';
import { List as ListProps } from '@/types/List';

export default function List({ id, color, title, cards }: ListProps) {
  const addCard = () => {
    createNewCard(id);
  };

  return (
    <div className={classes['list']}>
      <h3 style={{ borderColor: color }}>{title}</h3>
      <div className={classes.cards}>
        {cards.map((card) => (
          <CardItem
            key={card.id}
            id={card.id}
            listId={id}
            color={color}
            data={card}
          />
        ))}
      </div>
      <button onClick={addCard}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
}
