'use client';
import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import classes from './page.module.css';
import NewBoardInput from '@/components/NewBoardInput/NewBoardInput';
import { fetchUserBoards } from '@/lib/api/board';
import { Board } from '@/types/Board';
import BoardItem from '@/components/BoardItem/BoardItem';

export default function Home() {
  const [isTitleInput, setIsTitleInput] = useState<boolean>(false);
  const [userBoards, setUserBoards] = useState<Board[]>([]);

  useEffect(() => {
    const getData = async () => {
      const res = await fetchUserBoards();
      if ((res.status = 'ok')) {
        setUserBoards(res.data);
        console.log(userBoards);
      } else {
        // setError(res.error);
      }
    };

    getData();
  }, []);

  return (
    <div className="container">
      {userBoards.length === 0 && (
        <h1 className={classes['home-header']}>Create your first kanban!</h1>
      )}
      <div className={classes['link-box']}>
        <button
          className={classes['add-btn']}
          onClick={() => setIsTitleInput((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      {isTitleInput && <NewBoardInput />}
      {userBoards.length > 0 &&
        userBoards.map((board) => {
          return (
            <BoardItem
              key={board.id}
              id={board.id}
              title={board.title}
              updatedAt={board.updatedAt}
            />
          );
        })}
    </div>
  );
}
