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

interface ListItem {
  id: string;
  title: string;
  color: string;
  cards: Card[];
}

export { type List, type ListItem };
