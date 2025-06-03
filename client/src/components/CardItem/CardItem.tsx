'use client';
import { useRef, useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import classes from './CardItem.module.css';
import CardMenu from './CardMenu';

import { Card, CardChange } from '@/types/Card';

interface Props {
  color?: string;
  data: Card;
  onEmptyBlur: () => void;
  onChange: (newData: CardChange) => void;
  onMove: (id: string, direction: string) => void;
}

export default function CardItem({
  color,
  data,
  onEmptyBlur,
  onChange,
  onMove,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cardMenuRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        cardMenuRef.current &&
        !cardMenuRef.current.contains(e.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBlur = () => {
    if (inputRef.current && inputRef.current.value.trim() === '') {
      onEmptyBlur();
    }
  };

  const handleRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setShowMenu((prev) => !prev);
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    inputRef.current?.focus();
    setShowMenu((prev) => !prev);
  };

  return (
    <div
      className={classes['card-box']}
      style={{ borderColor: color }}
      onContextMenu={handleRightClick}
      onDoubleClick={handleDoubleClick}
    >
      <div className={classes['card-header']}>
        {showMenu && (
          <div ref={cardMenuRef}>
            <CardMenu
              onChange={(date) =>
                onChange({ id: data.id, newTargetDate: date })
              }
            />
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          value={data?.title}
          onChange={(e) => onChange({ id: data.id, newTitle: e.target.value })}
          onMouseDown={(e) => e.preventDefault()}
          onBlur={handleBlur}
        />
        <div className={classes['btn-box']}>
          {data.position > 0 && (
            <button onClick={() => onMove(data.id, 'up')}>
              <FontAwesomeIcon icon={faChevronUp} />{' '}
            </button>
          )}

          <button onClick={() => onMove(data.id, 'down')}>
            <FontAwesomeIcon icon={faChevronDown} />
          </button>
        </div>
      </div>
      <div className={classes['info']}>
        {data.targetDate && (
          <span className={classes['date-info']}>
            {data.targetDate && data.targetDate.toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
