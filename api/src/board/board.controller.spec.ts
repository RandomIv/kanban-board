import { Test, TestingModule } from '@nestjs/testing';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { Board, User } from 'generated/prisma';

describe('BoardController', () => {
  let controller: BoardController;
  let service: BoardService;

  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBoard: Board = {
    id: 'board-1',
    title: 'Test Board',
    description: 'Test Description',
    ownerId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Board;

  const mockBoardService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findManyByUserId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardController],
      providers: [
        {
          provide: BoardService,
          useValue: mockBoardService,
        },
      ],
    }).compile();

    controller = module.get<BoardController>(BoardController);
    service = module.get<BoardService>(BoardService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a board', async () => {
      const createBoardDto: CreateBoardDto = {
        title: 'New Board',
        description: 'New Description',
      };

      mockBoardService.create.mockResolvedValue(mockBoard);

      const result = await controller.create(mockUser, createBoardDto);

      expect(service.create).toHaveBeenCalledWith(mockUser.id, createBoardDto);
      expect(result).toEqual(mockBoard);
    });
  });

  describe('findOne', () => {
    it('should find a board by id', async () => {
      const boardId = 'board-1';
      mockBoardService.findOne.mockResolvedValue(mockBoard);

      const result = await controller.findOne(boardId);

      expect(service.findOne).toHaveBeenCalledWith(boardId);
      expect(result).toEqual(mockBoard);
    });
  });

  describe('findManyByUser', () => {
    it('should find boards by user', async () => {
      const mockBoards = [mockBoard];
      mockBoardService.findManyByUserId.mockResolvedValue(mockBoards);

      const result = await controller.findManyByUser(mockUser);

      expect(service.findManyByUserId).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockBoards);
    });
  });

  describe('update', () => {
    it('should update a board', async () => {
      const boardId = 'board-1';
      const updateBoardDto: UpdateBoardDto = {
        title: 'Updated Board',
      };

      const updatedBoard = { ...mockBoard, ...updateBoardDto };
      mockBoardService.update.mockResolvedValue(updatedBoard);

      const result = await controller.update(boardId, updateBoardDto);

      expect(service.update).toHaveBeenCalledWith(boardId, updateBoardDto);
      expect(result).toEqual(updatedBoard);
    });
  });

  describe('delete', () => {
    it('should delete a board', async () => {
      const boardId = 'board-1';
      mockBoardService.delete.mockResolvedValue(mockBoard);

      const result = await controller.delete(boardId);

      expect(service.delete).toHaveBeenCalledWith(boardId);
      expect(result).toEqual(mockBoard);
    });
  });
});
