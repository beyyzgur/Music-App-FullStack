import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './users/user.entity';
import { UserType } from './users/user-type.entity';
import { AuthModule } from './auth/auth.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { SongsModule } from './songs/songs.module';
import { FavoritesModule } from './favorites/favorites.module';
import { GenresModule } from './genres/genres.module';


@Module({
  imports: [
    // 1) .env dosyasını okumak için
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2) PostgreSQL bağlantısı (env'den okunuyor)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],


      // Geliştirmede kolaylık: tabloları otomatik oluşturur
      synchronize: true,
    }),

    AuthModule,

    ArtistsModule,

    AlbumsModule,

    SongsModule,

    FavoritesModule,

    GenresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
