import { create } from 'zustand';
import { Card } from '@/types/Card';

interface List {
  id: string;
  title: string;
  color: string;
  cards: Card[];
}

interface BoardState {
  lists: Record<string, List>;
  setLists: (newLists: Record<string, List>) => void;
  moveCardToAnotherList: (
    fromListId: string,
    toListId: string,
    cardId: string
  ) => void;
  updateListCards: (listId: string, newCards: Card[]) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  lists: {},

  setLists: (newLists) => set({ lists: newLists }),

  moveCardToAnotherList: (fromListId, toListId, cardId) =>
    set((state) => {
      const fromList = state.lists[fromListId];
      const toList = state.lists[toListId];
      if (!fromList || !toList) return state;

      const cardIndex = fromList.cards.findIndex((card) => card.id === cardId);
      if (cardIndex === -1) return state;

      const cardToMove = fromList.cards[cardIndex];
      const updatedFromCards = fromList.cards.filter(
        (card) => card.id !== cardId
      );
      const updatedToCards = [
        ...toList.cards,
        { ...cardToMove, position: toList.cards.length },
      ];

      updatedFromCards.forEach((card, idx) => (card.position = idx));
      updatedToCards.forEach((card, idx) => (card.position = idx));

      return {
        lists: {
          ...state.lists,
          [fromListId]: { ...fromList, cards: updatedFromCards },
          [toListId]: { ...toList, cards: updatedToCards },
        },
      };
    }),

  updateListCards: (listId, newCards) =>
    set((state) => ({
      lists: {
        ...state.lists,
        [listId]: {
          ...state.lists[listId],
          cards: newCards,
        },
      },
    })),
}));
