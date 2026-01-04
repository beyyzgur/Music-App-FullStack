import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { Song } from './song.entity';
import { Album } from '../albums/album.entity';
import { Genre } from 'src/genres/genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song, Album, Genre, ])],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
