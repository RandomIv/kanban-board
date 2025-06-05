import { useBoardStore } from '@/store/boardStore';
import { List } from '@/types/List';

const colors = ['#31363F', '#FF9F00', '#F4631E', '#309898'];

const createNewBoard = async (title: string | undefined) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token');

  const res = await fetch('http://localhost:5006/api/boards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) throw new Error('Failed to create board');

  return await res.json();
};

const fetchBoardData = async (boardId: string) => {
  const setBoardData = useBoardStore.getState().setBoardData;
  const setLists = useBoardStore.getState().setLists;

  try {
    const res = await fetch(`http://localhost:5006/api/boards/${boardId}`);
    if (!res.ok) throw new Error('Board not found');

    const data = await res.json();

    setBoardData({ id: data.id, title: data.title });

    const listMap: Record<string, List> = {};
    data.lists.forEach((list: List, index: number) => {
      listMap[list.id] = {
        ...list,
        color: colors[index % colors.length], // по колу, якщо більше 4 списків
      };
    });

    setLists(listMap);
    return { state: 'ok' };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    return { state: 'error', error };
  }
};

export { createNewBoard, fetchBoardData };
