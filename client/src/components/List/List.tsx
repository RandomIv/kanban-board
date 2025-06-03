'use client';

import { useState } from 'react';

import CardItem from '../CardItem/CardItem';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import classes from './List.module.css';

import { Card, CardChange } from '@/types/Card';
import {
  validateChangeCard,
  moveCardInList,
  createNewCard,
} from '@/utils/cardUtils';

interface Props {
  color: string;
  title: string;
}

export default function List({ color, title }: Props) {
  const [cards, setCards] = useState<Card[]>([]);

  const addCard = (): void => {
    setCards((prev) => createNewCard(prev));
  };

  const removeLastCardIfEmpty = (): void => {
    setCards((prev) => {
      return prev.slice(0, -1);
    });
  };

  const changeCard = (newData: CardChange) => {
    setCards((prev) => validateChangeCard(prev, newData));
  };

  const moveCard = (id: string, direction: string) => {
    setCards((prev) => moveCardInList(prev, id, direction));
  };

  const deleteCard = (id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  return (
    <div className={classes['list']}>
      <h3 style={{ borderColor: color }}>{title}</h3>
      <div className={classes.cards}>
        {cards.map((card) => {
          return (
            <CardItem
              key={card.id}
              color={color}
              data={card}
              onEmptyBlur={removeLastCardIfEmpty}
              onChange={changeCard}
              onMove={moveCard}
              onDelete={deleteCard}
            />
          );
        })}
      </div>
      <button onClick={addCard}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
}
