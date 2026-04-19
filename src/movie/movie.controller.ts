import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { MovieService } from './movie.service';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { describe } from 'node:test';
import { CreateMovieRequest } from './dto/create-movie.dto';
import { MoviePresponse } from './dto/movie.dto';

@ApiTags('Movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ApiOperation({
    summary: 'Take all films',
    description: 'All Films',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Not Found Film' })
  @Get()
  findAll() {
    return [
      {
        title: 'Film',
      },
    ];
  }

  @ApiOperation({
    summary: 'Take all films for id',
    description: 'Film Info',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'ID Film' })
  @ApiQuery({ name: 'year', type: 'number', description: 'Filter year ' })
  @ApiOkResponse({ description: 'Found Film', type: MoviePresponse })
  @ApiNotFoundResponse({
    description: 'Not Found',
    example: {
      status: 404,
      message: 'Movie not found',
      timestamp: '2222',
      path: '////',
    },
  })
  @Get(':id')
  findById() {
    return [
      {
        title: 'Film1',
      },
    ];
  }

  @ApiOperation({ summary: 'Create Film' })
  @Post()
  create(@Body() dto: CreateMovieRequest) {
    return dto;
  }
}
