import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { Album } from './album.entity';
import { Artist } from '../artists/artist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Artist])],
  controllers: [AlbumsController],
  providers: [AlbumsService],
})
export class AlbumsModule {}
