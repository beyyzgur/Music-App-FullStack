import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserType } from './user-type.entity';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserType]),
  ],
  providers: [UsersService],
  exports: [UsersService], // 🔥 BU SATIR ŞART
})
export class UsersModule {}
