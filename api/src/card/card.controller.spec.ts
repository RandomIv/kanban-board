import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { CreateCardDto } from './dtos/create-card.dto';
import { Card } from 'generated/prisma';

describe('CardController', () => {
  let controller: CardController;
  let service: CardService;

  const mockCard: Card = {
    id: 'card-1',
    title: 'Test Card',
    description: 'Test Description',
    position: 1,
    targetDate: new Date('2024-12-31'),
    listId: 'list-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCardService = {
    create: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [
        {
          provide: CardService,
          useValue: mockCardService,
        },
      ],
    }).compile();

    controller = module.get<CardController>(CardController);
    service = module.get<CardService>(CardService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a card', async () => {
      const createCardDto: CreateCardDto = {
        title: 'New Card',
        description: 'New Description',
        targetDate: new Date('2024-12-31'),
        listId: 'list-1',
      };

      mockCardService.create.mockResolvedValue(mockCard);

      const result = await controller.create(createCardDto);

      expect(service.create).toHaveBeenCalledWith(createCardDto);
      expect(result).toEqual(mockCard);
    });

    it('should create a card without optional fields', async () => {
      const createCardDto: CreateCardDto = {
        title: 'New Card',
        listId: 'list-1',
      };

      const cardWithoutOptionals = {
        ...mockCard,
        description: null,
        targetDate: null,
      };

      mockCardService.create.mockResolvedValue(cardWithoutOptionals);

      const result = await controller.create(createCardDto);

      expect(service.create).toHaveBeenCalledWith(createCardDto);
      expect(result).toEqual(cardWithoutOptionals);
    });
  });

  describe('findOne', () => {
    it('should find a card by id', async () => {
      const cardId = 'card-1';
      mockCardService.findOne.mockResolvedValue(mockCard);

      const result = await controller.findOne(cardId);

      expect(service.findOne).toHaveBeenCalledWith(cardId);
      expect(result).toEqual(mockCard);
    });
  });

  describe('delete', () => {
    it('should delete a card', async () => {
      const cardId = 'card-1';
      mockCardService.delete.mockResolvedValue(mockCard);

      const result = await controller.delete(cardId);

      expect(service.delete).toHaveBeenCalledWith(cardId);
      expect(result).toEqual(mockCard);
    });
  });
});
