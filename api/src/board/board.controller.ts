import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dtos/create-board.dto';
import { Board } from 'generated/prisma';
import { UpdateBoardDto } from './dtos/update-board.dto';

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
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Board> {
    return this.boardService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    return this.boardService.update(id, updateBoardDto);
  }
}
