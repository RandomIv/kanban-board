import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { Board } from 'generated/prisma';
import { DEFAULT_BOARD_LISTS } from './constants/default-board-lists';

describe('BoardService', () => {
  let service: BoardService;
  let prisma: PrismaService;

  const mockBoard: Board = {
    id: 'board-1',
    title: 'Test Board',
    description: 'Test Description',
    ownerId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Board;

  const mockPrismaService = {
    board: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BoardService>(BoardService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a board with default lists', async () => {
      const userId = 'user-1';
      const createBoardDto: CreateBoardDto = {
        title: 'New Board',
        description: 'New Description',
      };

      mockPrismaService.board.create.mockResolvedValue(mockBoard);

      const result = await service.create(userId, createBoardDto);

      expect(prisma.board.create).toHaveBeenCalledWith({
        data: {
          ...createBoardDto,
          owner: {
            connect: {
              id: userId,
            },
          },
          lists: {
            create: DEFAULT_BOARD_LISTS,
          },
        },
        include: {
          lists: {
            orderBy: { position: 'asc' },
            include: {
              cards: {
                orderBy: { position: 'asc' },
              },
            },
          },
        },
      });
      expect(result).toEqual(mockBoard);
    });
  });

  describe('findOne', () => {
    it('should find a board by id', async () => {
      const boardId = 'board-1';
      mockPrismaService.board.findUnique.mockResolvedValue(mockBoard);

      const result = await service.findOne(boardId);

      expect(prisma.board.findUnique).toHaveBeenCalledWith({
        where: { id: boardId },
        include: {
          lists: {
            orderBy: { position: 'asc' },
            include: {
              cards: {
                orderBy: { position: 'asc' },
              },
            },
          },
        },
      });
      expect(result).toEqual(mockBoard);
    });

    it('should throw NotFoundException when board not found', async () => {
      const boardId = 'non-existent-board';
      mockPrismaService.board.findUnique.mockResolvedValue(null);

      await expect(service.findOne(boardId)).rejects.toThrow(
        new NotFoundException(`Board with Id ${boardId} not found`),
      );
    });
  });

  describe('findManyByUserId', () => {
    it('should find boards by user id', async () => {
      const userId = 'user-1';
      const mockBoards = [mockBoard];
      mockPrismaService.board.findMany.mockResolvedValue(mockBoards);

      const result = await service.findManyByUserId(userId);

      expect(prisma.board.findMany).toHaveBeenCalledWith({
        where: {
          owner: {
            id: userId,
          },
        },
        include: {
          lists: {
            orderBy: { position: 'asc' },
            include: {
              cards: {
                orderBy: { position: 'asc' },
              },
            },
          },
        },
      });
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

      mockPrismaService.board.findUnique.mockResolvedValue(mockBoard);
      mockPrismaService.board.update.mockResolvedValue(updatedBoard);

      const result = await service.update(boardId, updateBoardDto);

      expect(prisma.board.findUnique).toHaveBeenCalledWith({
        where: { id: boardId },
      });
      expect(prisma.board.update).toHaveBeenCalledWith({
        where: { id: boardId },
        data: updateBoardDto,
        include: {
          lists: {
            orderBy: { position: 'asc' },
            include: {
              cards: {
                orderBy: { position: 'asc' },
              },
            },
          },
        },
      });
      expect(result).toEqual(updatedBoard);
    });

    it('should throw NotFoundException when board not found for update', async () => {
      const boardId = 'non-existent-board';
      const updateBoardDto: UpdateBoardDto = { title: 'Updated' };

      mockPrismaService.board.findUnique.mockResolvedValue(null);

      await expect(service.update(boardId, updateBoardDto)).rejects.toThrow(
        new NotFoundException(`Board with Id ${boardId} not found`),
      );
    });
  });

  describe('delete', () => {
    it('should delete a board', async () => {
      const boardId = 'board-1';

      mockPrismaService.board.findUnique.mockResolvedValue(mockBoard);
      mockPrismaService.board.delete.mockResolvedValue(mockBoard);

      const result = await service.delete(boardId);

      expect(prisma.board.findUnique).toHaveBeenCalledWith({
        where: { id: boardId },
      });
      expect(prisma.board.delete).toHaveBeenCalledWith({
        where: { id: boardId },
      });
      expect(result).toEqual(mockBoard);
    });

    it('should throw NotFoundException when board not found for delete', async () => {
      const boardId = 'non-existent-board';

      mockPrismaService.board.findUnique.mockResolvedValue(null);

      await expect(service.delete(boardId)).rejects.toThrow(
        new NotFoundException(`Board with Id ${boardId} not found`),
      );
    });
  });

  describe('checkBoardExists', () => {
    it('should not throw when board exists', async () => {
      const boardId = 'board-1';
      mockPrismaService.board.findUnique.mockResolvedValue(mockBoard);

      await expect(
        (service as any).checkBoardExists(boardId),
      ).resolves.not.toThrow();
    });

    it('should throw NotFoundException when board does not exist', async () => {
      const boardId = 'non-existent-board';
      mockPrismaService.board.findUnique.mockResolvedValue(null);

      await expect((service as any).checkBoardExists(boardId)).rejects.toThrow(
        new NotFoundException(`Board with Id ${boardId} not found`),
      );
    });
  });

  describe('getIncludeSortedListsAndCards', () => {
    it('should return correct include configuration', () => {
      const expected = {
        lists: {
          orderBy: { position: 'asc' },
          include: {
            cards: {
              orderBy: { position: 'asc' },
            },
          },
        },
      };

      const result = (service as any).getIncludeSortedListsAndCards();
      expect(result).toEqual(expected);
    });
  });
});
