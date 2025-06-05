import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dtos/create-card.dto';
import { Card } from 'generated/prisma';

@Injectable()
export class CardService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCardDto: CreateCardDto): Promise<Card> {
    const { listId, ...cardData } = createCardDto;

    const cardCount = await this.prisma.card.count({
      where: { listId },
    });

    return this.prisma.card.create({
      data: {
        ...cardData,
        position: cardCount + 1,
        list: {
          connect: {
            id: listId,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<Card> {
    const card = await this.prisma.card.findUnique({
      where: {
        id,
      },
    });

    if (!card) {
      throw new NotFoundException(`Card with Id ${id} not found`);
    }

    return card;
  }

  async delete(id: string): Promise<Card> {
    const { listId, position } = await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      const deletedCard = await tx.card.delete({
        where: { id },
      });

      await tx.card.updateMany({
        where: {
          listId,
          position: {
            gt: position,
          },
        },
        data: {
          position: {
            decrement: 1,
          },
        },
      });

      return deletedCard;
    });
  }
}
