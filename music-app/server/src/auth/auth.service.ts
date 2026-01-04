import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from '../users/user.entity';
import { UserType } from '../users/user-type.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Artist } from '../artists/artist.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserType) private readonly userTypeRepo: Repository<UserType>,
    @InjectRepository(Artist) private readonly artistRepo: Repository<Artist>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({ where: { username: dto.username } });
    if (existing) {
      throw new BadRequestException('Username already exists');
    }

    const userType = await this.userTypeRepo.findOne({ where: { name: dto.roleName } });
    if (!userType) {
      throw new BadRequestException('Role not found. Seed user_types first.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10); // password hashleniyor , salt round = 10

    const user = this.userRepo.create({
      username: dto.username,
      password: hashedPassword,
      userType,
    });

    const saved = await this.userRepo.save(user);

    // 🔥 EĞER ARTIST İSE → ARTIST PROFİLİ OLUŞTUR
if (saved.userType.name === 'artist') {
  const existingArtist = await this.artistRepo.findOne({
    where: { userId: saved.id },
  });

  if (!existingArtist) {
    const artist = this.artistRepo.create({
      name: saved.username, // birebir username
      userId: saved.id,     // 🔥 KRİTİK BAĞLANTI
      country: undefined,
      isCritical: false,
    });

    await this.artistRepo.save(artist);
  }
}

return {
  id: saved.id,
  username: saved.username,
  role: saved.userType.name,
};
  }

  async validateUser(username: string, password: string) {
  if (!username || !password) {
    throw new UnauthorizedException('username/password missing');
  }

  const user = await this.userRepo
    .createQueryBuilder('user')
    .addSelect('user.password') // 🔥 password select:false olsa bile getirir
    .leftJoinAndSelect('user.userType', 'userType')
    .where('user.username = :username', { username })
    .getOne();

  if (!user || !user.password) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // password’ü response’a taşıma
  const { password: _pw, ...safeUser } = user;
  return safeUser;
}

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.username, dto.password);
    if (!user) {
      throw new UnauthorizedException('Wrong username or password');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.userType.name,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
