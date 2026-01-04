import { Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { FavoritesService } from "./favorites.service";

@UseGuards(JwtAuthGuard)
@Controller("favorites")
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  list(@Req() req: any) {
    return this.favoritesService.list(req.user.id);
  }

  @Post(":songId")
  add(@Req() req: any, @Param("songId") songId: string) {
    return this.favoritesService.add(req.user.id, Number(songId));
  }

  @Delete(":songId")
  remove(@Req() req: any, @Param("songId") songId: string) {
    return this.favoritesService.remove(req.user.id, Number(songId));
  }
}
