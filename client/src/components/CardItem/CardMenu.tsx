'use client';
import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faTrash } from '@fortawesome/free-solid-svg-icons';
import classes from './CardItem.module.css';

interface Props {
  onChange: (newTargetDate: Date) => void;
  onDelete: () => void;
}

export default function CardMenu({ onChange, onDelete }: Props) {
  const [isDateInput, setIsDateInput] = useState<boolean>(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      onChange(new Date(dateValue));
      console.log(dateValue);
    }
  };

  return (
    <div className={classes['card-menu']}>
      <button
        onClick={() => {
          setIsDateInput((prev) => !prev);
        }}
      >
        <FontAwesomeIcon icon={faCalendarDays} />
      </button>
      <button onClick={onDelete}>
        <FontAwesomeIcon icon={faTrash} />{' '}
      </button>
      {isDateInput && <input type="date" onChange={handleDateChange} />}
    </div>
  );
}
