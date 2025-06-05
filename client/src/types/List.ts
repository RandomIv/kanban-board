import { Card } from './Card';

interface List {
  id: string;
  title: string;
  color: string;
  cards: Card[];
}

export { type List };
