import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dtos/create-board.dto';
import { isUUID } from 'class-validator';
import { DEFAULT_BOARD_LISTS } from './constants/default-board-lists';
import { Board } from 'generated/prisma';

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}
  async create(userId: string, createBoardDto: CreateBoardDto): Promise<Board> {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid uuid format');
    }

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
    return this.prisma.board.findUnique({
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
  }
}
