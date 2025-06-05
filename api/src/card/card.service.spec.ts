import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dtos/create-card.dto';
import { Card } from 'generated/prisma';

describe('CardService', () => {
  let service: CardService;
  let prisma: PrismaService;

  const mockCard: Card = {
    id: 'card-1',
    title: 'Test Card',
    description: 'Test Description',
    position: 2,
    targetDate: new Date('2024-12-31'),
    listId: 'list-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    card: {
      count: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      updateMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CardService>(CardService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a card with calculated position', async () => {
      const createCardDto: CreateCardDto = {
        title: 'New Card',
        description: 'New Description',
        targetDate: new Date('2024-12-31'),
        listId: 'list-1',
      };

      const cardCount = 1;
      const expectedPosition = cardCount + 1;

      mockPrismaService.card.count.mockResolvedValue(cardCount);
      mockPrismaService.card.create.mockResolvedValue({
        ...mockCard,
        position: expectedPosition,
      });

      const result = await service.create(createCardDto);

      expect(prisma.card.count).toHaveBeenCalledWith({
        where: { listId: createCardDto.listId },
      });

      expect(prisma.card.create).toHaveBeenCalledWith({
        data: {
          title: createCardDto.title,
          description: createCardDto.description,
          targetDate: createCardDto.targetDate,
          position: expectedPosition,
          list: {
            connect: {
              id: createCardDto.listId,
            },
          },
        },
      });

      expect(result.position).toBe(expectedPosition);
    });

    it('should create a card without optional fields', async () => {
      const createCardDto: CreateCardDto = {
        title: 'New Card',
        listId: 'list-1',
      };

      const cardCount = 0;
      const expectedPosition = cardCount + 1;

      mockPrismaService.card.count.mockResolvedValue(cardCount);
      mockPrismaService.card.create.mockResolvedValue({
        ...mockCard,
        description: null,
        targetDate: null,
        position: expectedPosition,
      });

      const result = await service.create(createCardDto);

      expect(prisma.card.create).toHaveBeenCalledWith({
        data: {
          title: createCardDto.title,
          position: expectedPosition,
          list: {
            connect: {
              id: createCardDto.listId,
            },
          },
        },
      });

      expect(result.position).toBe(expectedPosition);
    });

    it('should handle position calculation when list has multiple cards', async () => {
      const createCardDto: CreateCardDto = {
        title: 'New Card',
        listId: 'list-1',
      };

      const cardCount = 5;
      const expectedPosition = cardCount + 1;

      mockPrismaService.card.count.mockResolvedValue(cardCount);
      mockPrismaService.card.create.mockResolvedValue({
        ...mockCard,
        position: expectedPosition,
      });

      await service.create(createCardDto);

      expect(prisma.card.count).toHaveBeenCalledWith({
        where: { listId: createCardDto.listId },
      });
      expect(prisma.card.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            position: expectedPosition,
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should find a card by id', async () => {
      const cardId = 'card-1';
      mockPrismaService.card.findUnique.mockResolvedValue(mockCard);

      const result = await service.findOne(cardId);

      expect(prisma.card.findUnique).toHaveBeenCalledWith({
        where: { id: cardId },
      });
      expect(result).toEqual(mockCard);
    });

    it('should throw NotFoundException when card not found', async () => {
      const cardId = 'non-existent-card';
      mockPrismaService.card.findUnique.mockResolvedValue(null);

      await expect(service.findOne(cardId)).rejects.toThrow(
        new NotFoundException(`Card with Id ${cardId} not found`),
      );

      expect(prisma.card.findUnique).toHaveBeenCalledWith({
        where: { id: cardId },
      });
    });
  });

  describe('delete', () => {
    it('should delete a card and update positions of remaining cards', async () => {
      const cardId = 'card-1';
      const cardToDelete = { ...mockCard, position: 2 };

      jest.spyOn(service, 'findOne').mockResolvedValue(cardToDelete);

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          card: {
            delete: jest.fn().mockResolvedValue(cardToDelete),
            updateMany: jest.fn().mockResolvedValue({ count: 2 }),
          },
        };
        return callback(mockTx);
      });

      const result = await service.delete(cardId);

      expect(service.findOne).toHaveBeenCalledWith(cardId);
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result).toEqual(cardToDelete);

      const transactionCallback =
        mockPrismaService.$transaction.mock.calls[0][0];
      const mockTx = {
        card: {
          delete: jest.fn().mockResolvedValue(cardToDelete),
          updateMany: jest.fn().mockResolvedValue({ count: 2 }),
        },
      };

      await transactionCallback(mockTx);

      expect(mockTx.card.delete).toHaveBeenCalledWith({
        where: { id: cardId },
      });

      expect(mockTx.card.updateMany).toHaveBeenCalledWith({
        where: {
          listId: cardToDelete.listId,
          position: {
            gt: cardToDelete.position,
          },
        },
        data: {
          position: {
            decrement: 1,
          },
        },
      });
    });

    it('should handle deletion of last card in list', async () => {
      const cardId = 'card-1';
      const lastCard = { ...mockCard, position: 5 };

      jest.spyOn(service, 'findOne').mockResolvedValue(lastCard);

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          card: {
            delete: jest.fn().mockResolvedValue(lastCard),
            updateMany: jest.fn().mockResolvedValue({ count: 0 }),
          },
        };
        return callback(mockTx);
      });

      const result = await service.delete(cardId);

      expect(result).toEqual(lastCard);

      const transactionCallback =
        mockPrismaService.$transaction.mock.calls[0][0];
      const mockTx = {
        card: {
          delete: jest.fn().mockResolvedValue(lastCard),
          updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        },
      };

      await transactionCallback(mockTx);
      expect(mockTx.card.updateMany).toHaveBeenCalled();
    });

    it('should handle deletion when card is not found', async () => {
      const cardId = 'non-existent-card';

      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new NotFoundException(`Card with Id ${cardId} not found`),
        );

      await expect(service.delete(cardId)).rejects.toThrow(
        new NotFoundException(`Card with Id ${cardId} not found`),
      );

      expect(service.findOne).toHaveBeenCalledWith(cardId);
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should handle transaction errors', async () => {
      const cardId = 'card-1';
      const cardToDelete = { ...mockCard, position: 2 };

      jest.spyOn(service, 'findOne').mockResolvedValue(cardToDelete);

      const transactionError = new Error('Transaction failed');
      mockPrismaService.$transaction.mockRejectedValue(transactionError);

      await expect(service.delete(cardId)).rejects.toThrow(transactionError);

      expect(service.findOne).toHaveBeenCalledWith(cardId);
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });
});
