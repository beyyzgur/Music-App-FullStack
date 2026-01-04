import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  year?: number;

  @IsOptional()
  @IsInt()
  artistId: number;
}
