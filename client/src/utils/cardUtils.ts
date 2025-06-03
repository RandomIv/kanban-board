import { v4 as uuidv4 } from 'uuid';
import { Card, CardChange } from '@/types/Card';
import { useBoardStore } from '@/store/boardStore';

const createNewCard = (listId: string) => {
  const updateListCards = useBoardStore.getState().updateListCards;
  const lists = useBoardStore.getState().lists;

  const list = lists[listId];
  if (!list) return;

  const newCardId = uuidv4();
  const newCard: Card = {
    id: newCardId,
    title: '',
    position: list.cards.length,
  };

  updateListCards(listId, [...list.cards, newCard]);
};

const validateChangeCard = (prev: Card[], newData: CardChange) => {
  return prev.map((card) =>
    card.id === newData.id
      ? {
          ...card,
          ...(newData.newTitle !== undefined && { title: newData.newTitle }),
          ...(newData.newTargetDate !== undefined && {
            targetDate: newData.newTargetDate,
          }),
        }
      : card
  );
};

const moveCardInList = (prev: Card[], id: string, direction: string) => {
  const index = prev.findIndex((card) => card.id === id);
  if (index === -1) return prev;
  if (direction === 'up' && index === 0) return prev;
  if (direction === 'down' && index === prev.length - 1) return prev;

  const newCards = [...prev];
  const swapIndex = direction === 'up' ? index - 1 : index + 1;

  [newCards[index], newCards[swapIndex]] = [
    newCards[swapIndex],
    newCards[index],
  ];

  newCards.forEach((card, idx) => {
    card.position = idx;
  });

  return newCards;
};

const deleteCard = (listId: string, cardId: string) => {
  const lists = useBoardStore.getState().lists;
  const updateListCards = useBoardStore.getState().updateListCards;
  const listsArray = Object.values(lists);
  const list = listsArray.find((l) => l.id === listId);
  if (!list) return;

  const newCards = list.cards.filter((c) => c.id !== cardId);
  newCards.forEach((card, idx) => (card.position = idx));

  updateListCards(listId, newCards);
};

const moveCardToList = (
  listId: string,
  cardId: string,
  direction: 'left' | 'right'
) => {
  const lists = useBoardStore.getState().lists;
  const updateListCards = useBoardStore.getState().updateListCards;

  const listsArray = Object.values(lists);
  const currentIndex = listsArray.findIndex((l) => l.id === listId);
  if (currentIndex === -1) return;

  const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
  if (newIndex < 0 || newIndex >= listsArray.length) return;

  const currentList = listsArray[currentIndex];
  const targetList = listsArray[newIndex];

  const cardToMove = currentList.cards.find((c) => c.id === cardId);
  if (!cardToMove) return;

  const newCurrentCards = currentList.cards.filter((c) => c.id !== cardId);
  newCurrentCards.forEach((card, idx) => (card.position = idx));
  updateListCards(currentList.id, newCurrentCards);

  const newTargetCards = [
    ...targetList.cards,
    { ...cardToMove, position: targetList.cards.length },
  ];
  updateListCards(targetList.id, newTargetCards);
};

export {
  createNewCard,
  validateChangeCard,
  moveCardInList,
  deleteCard,
  moveCardToList,
};
