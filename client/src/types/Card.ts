interface Card {
  id: string;
  title: string;
  description?: string;
  position: number;
  targetDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CardChange {
  id: string;
  newTitle?: string;
  newTargetDate?: Date;
}

export { type Card, type CardChange };
