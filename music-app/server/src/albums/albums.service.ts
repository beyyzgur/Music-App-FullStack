import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './album.entity';
import { Artist } from '../artists/artist.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album) private readonly albumRepo: Repository<Album>,
    @InjectRepository(Artist) private readonly artistRepo: Repository<Artist>,
  ) {}

  async create(dto: CreateAlbumDto, user: any) {
  let artistId: number;

if (user.role === 'artist') {
  const artist = await this.artistRepo.findOne({
    where: { userId: user.id },
  });

  if (!artist) {
    throw new NotFoundException('Artist profile not found');
  }

  artistId = artist.id;
} else {
  artistId = dto.artistId;
}


  const artist = await this.artistRepo.findOne({ where: { id: artistId } });
  if (!artist) throw new NotFoundException('Artist not found');

  const album = this.albumRepo.create({
    title: dto.title,
    year: dto.year,
    artist,
  });

  return this.albumRepo.save(album);
}


  findAll() {
    return this.albumRepo.find({
      relations: { artist: true, songs: true },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const album = await this.albumRepo.findOne({
      where: { id },
      relations: { artist: true, songs: true },
    });
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  async findMyAlbums(user: any) {
  const artist = await this.artistRepo.findOne({
    where: { userId: user.id },
  });

  if (!artist) {
    return []; // artist profili yoksa boş dön
  }

  return this.albumRepo.find({
    where: { artist: { id: artist.id } },
    relations: { artist: true },
  });
}


  async update(id: number, dto: UpdateAlbumDto, user: any) {
  const album = await this.albumRepo.findOne({
    where: { id },
    relations: { artist: true },
  });

  if (!album) throw new NotFoundException('Album not found');

  // 🔐 ARTIST SADECE KENDİ ALBÜMÜ
  if (user.role === 'artist') {
    if (album.artist.userId !== user.id) {
      throw new ForbiddenException('You cannot edit this album');
    }
  }

  if (dto.title !== undefined) album.title = dto.title;
  if (dto.year !== undefined) album.year = dto.year;

  return this.albumRepo.save(album);
}


  async remove(id: number, user: any) {
  const album = await this.albumRepo.findOne({
    where: { id },
    relations: { artist: true },
  });

  if (!album) throw new NotFoundException('Album not found');

  if (user.role === 'artist') {
    if (album.artist.userId !== user.id) {
      throw new ForbiddenException('You cannot delete this album');
    }
  }

  await this.albumRepo.remove(album);
  return { ok: true };
}

}
