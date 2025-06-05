import { useBoardStore } from '@/store/boardStore';

const setBoardState = useBoardStore.getState().setBoardState;

const createCard = async (title: string, listId: string) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token');

  setBoardState('fetching');

  const res = await fetch('http://localhost:5006/api/cards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, listId }),
  });

  if (!res.ok) {
    setBoardState('error');
    throw new Error('Failed to create board');
  } else {
    setBoardState('up-to-date');
  }

  return await res.json();
};

const deleteCard = async (cardId: string) => {
  const token = localStorage.getItem('token');

  setBoardState('fetching');

  const res = await fetch(`http://localhost:5006/api/cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    setBoardState('error');
    throw new Error('Cannot delete your card');
  } else {
    setBoardState('up-to-date');
  }

  return { status: 'ok' };
};

export { createCard, deleteCard };
