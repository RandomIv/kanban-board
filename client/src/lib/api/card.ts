import { useBoardStore } from '@/store/boardStore';
import { apiUrl } from '@/utils/api';

const setBoardState = useBoardStore.getState().setBoardState;

const createCard = async (title: string, listId: string) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token');

  setBoardState('fetching');

  const res = await fetch(apiUrl('/cards'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, listId }),
  });

  if (!res.ok) {
    setBoardState('error');
    throw new Error('Failed to create card');
  }

  setBoardState('up-to-date');
  return res.json();
};

const deleteCard = async (cardId: string) => {
  const token = localStorage.getItem('token');

  setBoardState('fetching');

  const res = await fetch(apiUrl(`/cards/${cardId}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    setBoardState('error');
    throw new Error('Failed to delete card');
  }

  setBoardState('up-to-date');
  return { status: 'ok' };
};

export { createCard, deleteCard };
