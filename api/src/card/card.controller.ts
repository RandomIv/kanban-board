import { Body, Controller, Post } from '@nestjs/common';
import { CardService } from './card.service';
import { Card } from 'generated/prisma';
import { CreateCardDto } from './dtos/create-card.dto';

@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  async create(@Body() createCardDto: CreateCardDto): Promise<Card> {
    return this.cardService.create(createCardDto);
  }
}
