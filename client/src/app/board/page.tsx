'use client';

import { useEffect } from 'react';
import List from '@/components/List/List';
import classes from './page.module.css';
import { boardData } from '@/data/listData';
import { useBoardStore } from '@/store/boardStore';
import { Card } from '@/types/Card';

export default function BoardPage() {
  const setLists = useBoardStore((state) => state.setLists);
  const lists = useBoardStore((state) => state.lists);

  useEffect(() => {
    const initialLists: Record<
      string,
      { id: string; title: string; color: string; cards: Card[] }
    > = {};

    boardData.forEach((list) => {
      initialLists[list.id] = {
        ...list,
        cards: [],
      };
    });

    setLists(initialLists);
  }, [setLists]);

  return (
    <div className={classes['bg-fill']}>
      <div className={classes['board']}>
        {Object.values(lists).map((list) => (
          <List
            key={list.id}
            id={list.id}
            title={list.title}
            color={list.color}
            cards={list.cards}
          />
        ))}
      </div>
    </div>
  );
}
