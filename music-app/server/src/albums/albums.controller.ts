import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  findAll() {
    return this.albumsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my') // bu statik route oluyor, statik routelar her zaman parametreli route lardan önce gelmeli 
  findMyAlbums(@Req() req) {
  return this.albumsService.findMyAlbums(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumsService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'artist')
  @Post()
  create(@Body() dto: CreateAlbumDto, @Req() req) {
    return this.albumsService.create(dto, req.user);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'artist')
@Patch(':id')
update(@Param('id') id: string, @Body() dto: UpdateAlbumDto, @Req() req) {
  return this.albumsService.update(Number(id), dto, req.user);
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'artist')
@Delete(':id')
remove(@Param('id') id: string, @Req() req) {
  return this.albumsService.remove(Number(id), req.user);
}
}