import { Card } from './Card';

interface List {
  id: string;
  title: string;
  position: number;
  boardId: string;
  createdAt: string;
  updatedAt: string;
  cards: Card[];
  color: string;
}

export { type List };
