'use client';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDays,
  faTrash,
  faArrowLeft,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import classes from './CardItem.module.css';

import { deleteCard, moveCardToList } from '@/utils/cardUtils';
import { deleteCard as deleteCardReq } from '@/lib/api/card';

interface Props {
  cardId: string;
  listId: string;
  onChange: (newTargetDate: Date) => void;
}

export default function CardMenu({ cardId, listId, onChange }: Props) {
  const [isDateInput, setIsDateInput] = useState<boolean>(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      onChange(new Date(dateValue));
    }
  };

  const handleDelete = () => {
    deleteCard(listId, cardId);
    deleteCardReq(cardId);
  };

  return (
    <div className={classes['card-menu']}>
      <button onClick={() => setIsDateInput((prev) => !prev)}>
        <FontAwesomeIcon icon={faCalendarDays} />
      </button>
      <button onClick={handleDelete}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
      <button onClick={() => moveCardToList(listId, cardId, 'left')}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <button onClick={() => moveCardToList(listId, cardId, 'right')}>
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
      {isDateInput && <input type="date" onChange={handleDateChange} />}
    </div>
  );
}
