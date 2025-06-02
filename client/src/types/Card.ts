interface Card {
  id: string;
  title: string;
  description?: string;
  position: number;
  targetDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export { type Card };
