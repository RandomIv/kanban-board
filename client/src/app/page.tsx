'use client';
import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import classes from './page.module.css';
import NewBoardInput from '@/components/NewBoardInput/NewBoardInput';

export default function Home() {
  const [isTitleInput, setIsTitleInput] = useState<boolean>(false);

  return (
    <div className="container">
      <h1 className={classes['home-header']}>Create your first kanban!</h1>
      <div className={classes['link-box']}>
        <button
          className={classes['add-btn']}
          onClick={() => setIsTitleInput((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      {isTitleInput && <NewBoardInput />}
    </div>
  );
}
