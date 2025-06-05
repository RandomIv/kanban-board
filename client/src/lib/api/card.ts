const createCard = async (title: string, listId: string) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token');

  const res = await fetch('http://localhost:5006/api/cards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, listId }),
  });

  console.log(res);

  if (!res.ok) throw new Error('Failed to create board');

  return await res.json();
};

const deleteCard = async (cardId: string) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5006/api/cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Cannot delete your card');

  return { status: 'ok' };
};

export { createCard, deleteCard };
