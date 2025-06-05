'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';

import List from '@/components/List/List';
import MessageBox from '@/components/MessageBox/MessageBox';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import classes from './page.module.css';

import { changeBoard, deleteBoard, fetchBoardData } from '@/lib/api/board';
import { useBoardStore } from '@/store/boardStore';
import { useEffect, useState } from 'react';

export default function BoardPage() {
  const router = useRouter();
  const params = useParams();
  const boardId = params?.boardSlug as string;

  const board = useBoardStore((state) => state.board);
  const lists = useBoardStore((state) => state.lists);

  const [newTitle, setNewTitle] = useState<string>(board?.title ?? '');

  console.log(board?.title);

  const date = new Date(board?.updatedAt ?? Date.now());
  const formattedDate = date.toLocaleString();

  useEffect(() => {
    if (board?.title) {
      setNewTitle(board.title);
    }
  }, [board?.title]);

  const { isLoading, isError, error } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => fetchBoardData(boardId),
    refetchOnWindowFocus: false,
  });

  const { mutate: deleteBoardMutate, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteBoard(boardId),
    onSuccess: () => {
      router.push('/');
    },
    onError: (error: unknown) => {
      const err = error as Error;
      alert(`Failed to delete board: ${err.message}`);
    },
  });

  const { mutate: changeTitleMutate } = useMutation({
    mutationFn: () => changeBoard(boardId, newTitle),
    onSuccess: () => {},
    onError: (error: unknown) => {
      const err = error as Error;
      alert(`Failed to change board title: ${err.message}`);
    },
  });

  const handleDelete = () => {
    const confirmDelete = confirm(
      'Are you sure you want to delete this board?'
    );
    if (confirmDelete) deleteBoardMutate();
  };

  if (isLoading) return <MessageBox>Loading...</MessageBox>;
  if (isError)
    return (
      <MessageBox type="error">
        Error: {(error as Error).message || 'Failed to load board'}
      </MessageBox>
    );

  return (
    <div className={classes['bg-fill']}>
      <div className={classes['board-header']}>
        <div className={classes['board-title']}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={() => {
              if (newTitle.trim() !== board?.title) {
                changeTitleMutate();
              }
            }}
            className={classes['board-title-input']}
          />
        </div>

        <div className={classes['date-delete-box']}>
          <span>{formattedDate}</span>
          <button onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : <FontAwesomeIcon icon={faTrash} />}
          </button>
        </div>
      </div>
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
