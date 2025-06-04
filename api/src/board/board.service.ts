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
      include: this.getIncludeSortedListsAndCards(),
    });
  }

  async findOne(id: string): Promise<Board> {
    const board = await this.prisma.board.findUnique({
      where: {
        id,
      },
      include: this.getIncludeSortedListsAndCards(),
    });

    if (!board) {
      throw new NotFoundException(`Board with Id ${id} not found`);
    }

    return board;
  }

  async findManyByUserId(userId: string): Promise<Board[]> {
    return this.prisma.board.findMany({
      where: {
        owner: {
          id: userId,
        },
      },
      include: this.getIncludeSortedListsAndCards(),
    });
  }

  async update(id: string, updateBoardDto: UpdateBoardDto): Promise<Board> {
    await this.checkBoardExists(id);

    return this.prisma.board.update({
      where: {
        id,
      },
      data: {
        ...updateBoardDto,
      },
      include: this.getIncludeSortedListsAndCards(),
    });
  }

  async delete(id: string): Promise<Board> {
    await this.checkBoardExists(id);

    return this.prisma.board.delete({
      where: {
        id,
      },
    });
  }

  private async checkBoardExists(id: string): Promise<void> {
    const board = await this.prisma.board.findUnique({
      where: {
        id,
      },
    });

    if (!board) {
      throw new NotFoundException(`Board with Id ${id} not found`);
    }
  }

  private getIncludeSortedListsAndCards() {
    return {
      lists: {
        orderBy: { position: 'asc' },
        include: {
          cards: {
            orderBy: { position: 'asc' },
          },
        },
      },
    } as const;
  }
}
