import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dtos/create-board.dto';
import { DEFAULT_BOARD_LISTS } from './constants/default-board-lists';
import { Board } from 'generated/prisma';
import { UpdateBoardDto } from './dtos/update-board.dto';

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}
  async create(userId: string, createBoardDto: CreateBoardDto): Promise<Board> {
    return this.prisma.board.create({
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
  }

  async findOne(id: string): Promise<Board> {
    const board = await this.prisma.board.findUnique({
      where: {
        id,
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

    if (!board) {
      throw new NotFoundException(`Board with Id ${id} not found`);
    }

    return board;
  }

  async update(id: string, updateBoardDto: UpdateBoardDto): Promise<Board> {
    const board = await this.prisma.board.findUnique({
      where: {
        id,
      },
    });

    if (!board) {
      throw new NotFoundException(`Board with Id ${id} not found`);
    }

    return this.prisma.board.update({
      where: {
        id,
      },
      data: {
        ...updateBoardDto,
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
  }
}
