'use client';

import { useState } from 'react';

import CardItem from '../CardItem/CardItem';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import classes from './List.module.css';

import { Card } from '@/types/Card';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  color: string;
  title: string;
}

export default function List({ color, title }: Props) {
  const [cards, setCards] = useState<Card[]>([]);

  const addCard = (): void => {
    setCards((prev) => {
      const newId = uuidv4();
      const newCards: Card[] = [
        ...prev,
        { id: newId, title: '', position: prev.length },
      ];
      return newCards;
    });
  };

  const removeLastCardIfEmpty = (): void => {
    setCards((prev) => {
      return prev.slice(0, -1);
    });
  };

  const changeCard = (newData: {
    id: string;
    newTitle?: string;
    newTargetDate?: Date;
  }) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === newData.id
          ? {
              ...card,
              ...(newData.newTitle !== undefined && {
                title: newData.newTitle,
              }),
              ...(newData.newTargetDate !== undefined && {
                targetDate: newData.newTargetDate,
              }),
            }
          : card
      )
    );
  };

  const moveCard = (id: string, direction: string) => {
    setCards((prev) => {
      const index = prev.findIndex((card) => card.id === id);

      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;

      const newCards = [...prev];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;

      [newCards[index], newCards[swapIndex]] = [
        newCards[swapIndex],
        newCards[index],
      ];

      newCards.forEach((card, idx) => {
        card.position = idx;
      });

      return newCards;
    });
  };

  return (
    <div className={classes['list']}>
      <h3 style={{ borderColor: color }}>{title}</h3>
      <div className={classes.cards}>
        {cards.map((card, index) => {
          return (
            <CardItem
              key={index}
              color={color}
              data={card}
              onEmptyBlur={removeLastCardIfEmpty}
              onChange={changeCard}
              onMove={moveCard}
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
