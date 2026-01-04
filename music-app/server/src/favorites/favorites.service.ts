import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Favorite } from "./favorite.entity";

@Injectable()
export class FavoritesService {
  constructor(@InjectRepository(Favorite) private readonly favRepo: Repository<Favorite>) {}

  async list(userId: number) {
    return this.favRepo.find({
      where: { userId },
      relations: { song: { album: { artist: true } } as any },
      order: { createdAt: "DESC" },
    });
  }

  async add(userId: number, songId: number) {
    if (!Number.isFinite(songId)) throw new BadRequestException("Invalid songId");

    const existing = await this.favRepo.findOne({ where: { userId, songId } });
    if (existing) return existing;

    const fav = this.favRepo.create({ userId, songId });
    return this.favRepo.save(fav);
  }

  async remove(userId: number, songId: number) {
    await this.favRepo.delete({ userId, songId });
    return { ok: true };
  }
}
