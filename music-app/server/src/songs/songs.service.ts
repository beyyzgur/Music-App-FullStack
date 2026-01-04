import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './song.entity';
import { Album } from '../albums/album.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { In } from 'typeorm';
import { Genre } from '../genres/genre.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song) private readonly songRepo: Repository<Song>,
    @InjectRepository(Album) private readonly albumRepo: Repository<Album>,
    @InjectRepository(Genre) private readonly genreRepo: Repository<Genre>,

  ) {}

 async create(dto: CreateSongDto) {
  const album = await this.albumRepo.findOne({
    where: { id: dto.albumId },
    relations: { artist: true },
  });
  if (!album) throw new NotFoundException('Album not found');

  let genres: Genre[] = [];

  if (dto.genreIds?.length) {
    genres = await this.genreRepo.findBy({
      id: In(dto.genreIds),
    });
  }

  const song = this.songRepo.create({
    title: dto.title,
    durationSec: dto.durationSec,
    trackNo: dto.trackNo,
    album,
    genres, // 🔥 ilişki burada kuruluyor
  });

  return this.songRepo.save(song);
}


  findAll() {
    return this.songRepo.find({
      relations: { album: { artist: true },
      genres: true, },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const song = await this.songRepo.findOne({
      where: { id },
      relations: { album: { artist: true },
      genres: true, },
    });
    if (!song) throw new NotFoundException('Song not found');
    return song;
  }

async update(id: number, dto: UpdateSongDto, user: any) {
  const song = await this.songRepo.findOne({
    where: { id },
    relations: { album: { artist: true }, genres: true },
  });

  if (!song) throw new NotFoundException('Song not found');

  if (user.role === 'artist') {
    if (song.album.artist.name !== user.username) {
      throw new ForbiddenException('You cannot edit this song');
    }
  }

  // 🎯 MANY TO MANY UPDATE
  if (dto.genreIds) {
    const genres = await this.genreRepo.findBy({
      id: In(dto.genreIds),
    });
    song.genres = genres;
  }

  // normal alanlar
  if (dto.title !== undefined) song.title = dto.title;
  if (dto.durationSec !== undefined) song.durationSec = dto.durationSec;
  if (dto.trackNo !== undefined) song.trackNo = dto.trackNo;

  return this.songRepo.save(song);
}

async remove(id: number, user: any) {
  const song = await this.songRepo.findOne({
    where: { id },
    relations: { album: { artist: true } },
  });

  if (!song) throw new NotFoundException('Song not found');

  if (user.role === 'artist') {
    if (song.album.artist.name !== user.username) {
      throw new ForbiddenException('You cannot delete this song');
    }
  }

  await this.songRepo.remove(song);
  return { ok: true };
}


  // İstersen ekstra: albümün şarkıları (trackNo ile sıralı)
  findByAlbum(albumId: number) {
    return this.songRepo.find({
      where: { album: { id: albumId } },
      relations: { album: true, genres: true, },
      order: { trackNo: 'ASC', id: 'ASC' },
    });
  }
}
