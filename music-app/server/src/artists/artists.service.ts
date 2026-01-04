import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Artist } from './artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { User } from 'src/users/user.entity';
import { UserType } from 'src/users/user-type.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepo: Repository<Artist>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(UserType)
    private readonly userTypeRepo: Repository<UserType>,
  ) {}

  /* ================= READ ================= */

  findAll() {
    return this.artistRepo.find({
      select: [
        'id',
        'name',
        'country',
        'isCritical',
        'userId',
        'createdAt',
        'updatedAt',
      ],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const artist = await this.artistRepo.findOne({
      where: { id },
      select: [
        'id',
        'name',
        'country',
        'isCritical',
        'userId',
        'createdAt',
        'updatedAt',
      ],
      relations: ['albums'],
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  /* ================= CREATE ================= */

  async create(dto: CreateArtistDto) {
    // 1️⃣ username zaten var mı?
    const existingUser = await this.userRepo.findOne({
      where: { username: dto.username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // 2️⃣ artist role al
    const artistRole = await this.userTypeRepo.findOne({
      where: { name: 'artist' },
    });

    if (!artistRole) {
      throw new NotFoundException('Artist role not found');
    }

    // 3️⃣ password hash
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 4️⃣ user oluştur
    const user = this.userRepo.create({
      username: dto.username,
      password: hashedPassword,
      userType: artistRole,
    });

    const savedUser = await this.userRepo.save(user);

    // 5️⃣ artist oluştur
    const artist = this.artistRepo.create({
      name: dto.name,
      country: dto.country,
      isCritical: dto.isCritical ?? false,
      userId: savedUser.id,
    });

    return this.artistRepo.save(artist);
  }

  /* ================= UPDATE ================= */

  async update(id: number, dto: UpdateArtistDto, user: any) {
  const artist = await this.artistRepo.findOne({
    where: { id },
  });

  if (!artist) {
    throw new NotFoundException('Artist not found');
  }

  // 🔐 YETKİ KONTROLÜ
  if (user.role !== 'admin' && artist.userId !== user.id) {
    throw new ForbiddenException(
      'You can only update your own artist profile',
    );
  }

  // 🔁 NAME DEĞİŞİYORSA → USERS TABLOSUNU DA GÜNCELLE
  if (dto.name && dto.name !== artist.name) {
    // 1️⃣ Artist name unique mi?
    const artistExists = await this.artistRepo.findOne({
      where: { name: dto.name },
    });

    if (artistExists) {
      throw new ConflictException('Artist name already exists');
    }

    // 2️⃣ Eğer artist bir user’a bağlıysa → username güncelle
    if (artist.userId) {
      const userEntity = await this.userRepo.findOne({
        where: { id: artist.userId },
      });

      if (!userEntity) {
        throw new NotFoundException('Linked user not found');
      }

      // Username unique mi?
      const userExists = await this.userRepo.findOne({
        where: { username: dto.name },
      });

      if (userExists) {
        throw new ConflictException('Username already exists');
      }

      userEntity.username = dto.name;
      await this.userRepo.save(userEntity);
    }

    artist.name = dto.name;
  }

  // 🔧 DİĞER ALANLAR
  if (dto.country !== undefined) {
    artist.country = dto.country;
  }

  if (dto.isCritical !== undefined) {
    artist.isCritical = dto.isCritical;
  }

  return this.artistRepo.save(artist);
}


  /* ================= DELETE ================= */

 async remove(id: number, user: any) {
  const artist = await this.artistRepo.findOne({
    where: { id },
  });

  if (!artist) {
    throw new NotFoundException('Artist not found');
  }

  // 🔐 ARTIST KENDİ HESABINI SİLİYOR
  if (user.role === 'artist') {
    if (artist.userId !== user.id) {
      throw new ForbiddenException(
        'You can only delete your own artist profile',
      );
    }

    // ✅ ÖNCE USER SİL
    await this.userRepo.delete(user.id);

    // ❗ Artist tablosunu ayrıca silmeye GEREK YOK
    // çünkü bu userId artık orphan → cleanup aşağıda
    await this.artistRepo.delete({ userId: user.id });

    return { ok: true };
  }

  // 👑 ADMIN HERHANGİ BİR ARTISTİ SİLİYOR
  if (user.role === 'admin') {
    if (artist.userId) {
      // 🔥 ARTIST BİR USER’A BAĞLIYSA → USER’I SİL
      await this.userRepo.delete(artist.userId);
    }

    // 🔥 ARTIST KAYDINI DA SİL
    await this.artistRepo.delete(artist.id);

    return { ok: true };
  }

  throw new ForbiddenException('Unauthorized');
}
}
