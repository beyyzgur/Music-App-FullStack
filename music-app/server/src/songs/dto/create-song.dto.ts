import { ArrayUnique, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateSongDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @Min(0)
  durationSec: number;

  @IsInt()
  albumId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  trackNo?: number;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  genreIds?: number[];
}
