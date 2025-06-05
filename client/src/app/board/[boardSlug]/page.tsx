'use client';

import { useEffect, useState } from 'react';
import { useBoardStore } from '@/store/boardStore';
import List from '@/components/List/List';
import classes from './page.module.css';
import { useParams } from 'next/navigation';
import { fetchBoardData } from '@/lib/api/board';

export default function BoardPage() {
  const params = useParams();
  const boardId = params?.boardSlug as string;

  const board = useBoardStore((state) => state.board);
  const lists = useBoardStore((state) => state.lists);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getData = async () => {
      const res = await fetchBoardData(boardId);
      if ((res.status = 'ok')) {
        setLoading(false);
      } else {
        setError(res.error);
      }
    };

    getData();
  }, [boardId]);

  if (loading) return <p className={classes['loading']}>Loading...</p>;
  if (error) return <p className={classes['error']}>{error}</p>;

  return (
    <div className={classes['bg-fill']}>
      <h1 className={classes['board-title']}>{board?.title}</h1>
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
