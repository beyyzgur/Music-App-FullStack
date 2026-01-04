import { Body, Controller, Get, Post } from '@nestjs/common';
import { GenresService } from './genres.service';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  findAll() {
    return this.genresService.findAll();
  }

  @Post()
  create(@Body('name') name: string) {
    return this.genresService.create(name);
  }
}
