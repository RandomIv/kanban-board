import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import classes from './NewBoardInput.module.css';

import { createNewBoard } from '@/lib/api/board';
import { useBoardStore } from '@/store/boardStore';

export default function NewBoardInput() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleCreateBoard = async () => {
    if (inputRef.current && inputRef.current.value.trim() === '') {
      setErrorText('Enter a new board name!');
      return;
    } else {
      setErrorText(null);
    }

    try {
      const board = await createNewBoard(inputRef.current?.value);
      useBoardStore.getState().setBoardData(board); // зберігаємо у store
      router.push(`/board/${board.id}`);
    } catch (err) {
      console.error('Failed to create board:', err);
    }
  };

  return (
    <>
      <div className={classes['board-title']}>
        <input ref={inputRef} type="text" />
      </div>
      {errorText && (
        <div className={classes['error-box']}>
          <span>{errorText}</span>
        </div>
      )}
      <div className={classes['board-title']}>
        <button onClick={handleCreateBoard}>Create</button>
      </div>
    </>
  );
}
