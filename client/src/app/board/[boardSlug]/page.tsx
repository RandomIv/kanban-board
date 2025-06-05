'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { fetchBoardData } from '@/lib/api/board';
import { useBoardStore } from '@/store/boardStore';
import List from '@/components/List/List';
import classes from './page.module.css';
import MessageBox from '@/components/MessageBox/MessageBox';

export default function BoardPage() {
  const params = useParams();
  const boardId = params?.boardSlug as string;

  const board = useBoardStore((state) => state.board);
  const lists = useBoardStore((state) => state.lists);

  const { isLoading, isError, error } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => fetchBoardData(boardId),
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <MessageBox>Loading...</MessageBox>;
  if (isError)
    return (
      <MessageBox type="error">
        Error: {(error as Error).message || 'Failed to load board'}
      </MessageBox>
    );

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
