import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dtos/create-board.dto';
import { Board } from 'generated/prisma';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}
  @Post()
  async create(
    @Req() req,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<Board> {
    req.user = { id: req.headers['x-user-id'] };
    return this.boardService.create(req.user.id, createBoardDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Board> {
    return this.boardService.findOne(id);
  }
}
