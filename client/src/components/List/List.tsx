'use client';

import { useState } from 'react';

import CardItem from '../CardItem/CardItem';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import classes from './List.module.css';

import { Card } from '@/types/Card';

interface Props {
  color: string;
  title: string;
}

export default function List({ color, title }: Props) {
  const [cards, setCards] = useState<Card[]>([]);

  const addCard = (): void => {
    setCards((prev) => {
      const now: Date = new Date();
      const datePart: string = now.toISOString().slice(0, 10).replace(/-/g, '');

      const newCards: Card[] = [
        ...prev,
        { id: datePart, title: 'something', position: prev.length },
      ];

      console.log(newCards);

      return newCards;
    });
  };

  return (
    <div className={classes['list']}>
      <h3 style={{ borderColor: color }}>{title}</h3>
      <div className={classes.cards}>
        {cards.map((card, index) => {
          return <CardItem key={index} color={color} />;
        })}
      </div>
      <button onClick={addCard}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
}
