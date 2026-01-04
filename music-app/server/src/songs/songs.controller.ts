import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  // ✅ PUBLIC: tüm şarkılar
  @Get()
  findAll() {
    return this.songsService.findAll();
  }

  // ✅ PUBLIC: albüme göre filtre (DİKKAT: :id'den önce!)
  @Get('by-album/:albumId')
  findByAlbum(@Param('albumId', ParseIntPipe) albumId: number) {
    return this.songsService.findByAlbum(albumId);
  }

  // ✅ PUBLIC: tek şarkı
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.songsService.findOne(id);
  }

  // 🔒 ADMIN + ARTIST: create
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'artist')
  create(@Body() dto: CreateSongDto) {
    return this.songsService.create(dto);
  }

 @Patch(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'artist')
update(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateSongDto,
  @Req() req,
) {
  return this.songsService.update(id, dto, req.user);
}


@Delete(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'artist')
remove(
  @Param('id', ParseIntPipe) id: number,
  @Req() req,
) {
  return this.songsService.remove(id, req.user);
}

}
