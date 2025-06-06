'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import NewBoardInput from '@/components/NewBoardInput/NewBoardInput';
import BoardItem from '@/components/BoardItem/BoardItem';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import classes from './page.module.css';

import { fetchUserBoards } from '@/lib/api/board';
import { Board } from '@/types/Board';
import MessageBox from '@/components/MessageBox/MessageBox';

import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const [isTitleInput, setIsTitleInput] = useState(false);

  const { isAuthenticated, loadToken } = useAuthStore();

  useEffect(() => {
    loadToken();
  }, []);

  const {
    data: userBoards = [],
    isLoading,
    isError,
    error,
  } = useQuery<Board[]>({
    queryKey: ['userBoards'],
    queryFn: fetchUserBoards,
    enabled: isAuthenticated,
  });

  return (
    <div className="container">
      {!isAuthenticated ? (
        <div className={classes['unauthenticated']}>
          <h1 className={classes['home-header']}>Welcome to Kanban App 📋</h1>
          <p>
            Please <strong>log in</strong> or <strong>sign up</strong> to get
            started.
          </p>
        </div>
      ) : (
        <>
          <div className={classes['link-box']}>
            <button
              className={classes['add-btn']}
              onClick={() => setIsTitleInput((prev) => !prev)}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          {!isLoading && userBoards.length === 0 && (
            <h1 className={classes['home-header']}>
              Create your first kanban!
            </h1>
          )}

          {isTitleInput && <NewBoardInput />}
          {isLoading && <MessageBox>Loading...</MessageBox>}
          {isError && (
            <MessageBox type="error">
              Error: {(error as Error).message}
            </MessageBox>
          )}

          {userBoards.length > 0 &&
            userBoards.map((board) => (
              <BoardItem
                key={board.id}
                id={board.id}
                title={board.title}
                updatedAt={board.updatedAt}
              />
            ))}
        </>
      )}
    </div>
  );
}
