import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { User } from 'src/users/user.entity';
import { UserType } from 'src/users/user-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, User, UserType])],
  controllers: [ArtistsController],
  providers: [ArtistsService],
})
export class ArtistsModule {}
