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

  const res = await fetch(`http://localhost:5006/api/boards/${boardId}`);
  if (!res.ok) throw new Error('Board not found');

  const data = await res.json();

  setBoardData({
    id: data.id,
    title: data.title,
    description: data.description,
    ownerId: data.ownerId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    lists: data.lists,
  });

  const listMap: Record<string, List> = {};
  data.lists.forEach((list: List, index: number) => {
    listMap[list.id] = {
      ...list,
      color: colors[index % colors.length],
    };
  });

  setLists(listMap);
  return { status: 'ok' };
};

const fetchUserBoards = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5006/api/boards', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Cannot fetch your boards');

  const data = await res.json();
  return data;
};

const deleteBoard = async (boardId: string) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5006/api/boards/${boardId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Cannot fetch your boards');

  return { status: 'ok' };
};

export { createNewBoard, fetchBoardData, fetchUserBoards, deleteBoard };
