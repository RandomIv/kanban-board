import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dtos/create-board.dto';
import { Board, User } from 'generated/prisma';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: User,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<Board> {
    return this.boardService.create(user.id, createBoardDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Board> {
    return this.boardService.findOne(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findManyByUser(@CurrentUser() user: User): Promise<Board[]> {
    return this.boardService.findManyByUserId(user.id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    return this.boardService.update(id, updateBoardDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<Board> {
    return this.boardService.delete(id);
  }
}
