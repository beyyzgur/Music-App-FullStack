import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  IsArray,
  ArrayUnique,
} from 'class-validator';

export class UpdateSongDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  durationSec?: number;

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
