import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './genre.entity';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepo: Repository<Genre>,
  ) {}

  findAll() {
    return this.genreRepo.find();
  }

  create(name: string) {
    return this.genreRepo.save({ name });
  }
}
