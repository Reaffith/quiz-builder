import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from 'src/dto/create-quizz.dto';
import { PaginationQueryDto } from 'src/dto/pagination.dto';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  async create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }

  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    const { offset = 0, limit = 20 } = query;
    return this.quizzesService.findAll(offset, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.quizzesService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.quizzesService.remove(id);
  }
}
