import { v4 as uuidv4 } from 'uuid';
import { Card, CardChange } from '@/types/Card';

const createNewCard = (prev: Card[]) => {
  const newId = uuidv4();
  const newCards: Card[] = [
    ...prev,
    { id: newId, title: '', position: prev.length },
  ];
  return newCards;
};

const validateChangeCard = (prev: Card[], newData: CardChange) => {
  return prev.map((card) =>
    card.id === newData.id
      ? {
          ...card,
          ...(newData.newTitle !== undefined && {
            title: newData.newTitle,
          }),
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

export { createNewCard, validateChangeCard, moveCardInList };
