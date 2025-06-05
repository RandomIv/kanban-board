'use client';
import { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import classes from './CardItem.module.css';
import CardMenu from './CardMenu';

import { Card, CardChange } from '@/types/Card';
import { useBoardStore } from '@/store/boardStore';
import { validateChangeCard, moveCardInList } from '@/utils/cardUtils';

interface Props {
  id: string;
  listId: string;
  color?: string;
  data: Card;
}

export default function CardItem({ id, listId, color, data }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cardMenuRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const lists = useBoardStore((state) => state.lists);
  const updateListCards = useBoardStore((state) => state.updateListCards);

  const cards = lists[listId]?.cards || [];

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
      removeLastCardIfEmpty();
    }
  };

  const removeLastCardIfEmpty = () => {
    const lastCard = cards[cards.length - 1];
    if (lastCard && lastCard.title.trim() === '') {
      updateListCards(listId, cards.slice(0, -1));
    }
  };

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setShowMenu((prev) => !prev);
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    inputRef.current?.focus();
    setShowMenu((prev) => !prev);
  };

  const onChange = (change: CardChange) => {
    const updatedCards = validateChangeCard(cards, change);
    updateListCards(listId, updatedCards);
  };

  const onMove = (cardId: string, direction: string) => {
    const updatedCards = moveCardInList(cards, cardId, direction);
    updateListCards(listId, updatedCards);
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
              cardId={id}
              listId={listId}
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
              <FontAwesomeIcon icon={faChevronUp} />
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
            {data.targetDate.toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
