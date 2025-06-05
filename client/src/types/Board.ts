import { List } from './List';

interface Board {
  id: string;
  title: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  lists: List[];
}

export { type Board };
