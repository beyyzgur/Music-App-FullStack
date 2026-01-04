import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { PasswordDto } from '../../auth/dto/password.dto';

export class CreateArtistDto extends PasswordDto {
  @IsString()
  username: string; // login username

  @IsString()
  @Length(2, 100)
  name: string; // artist display name

  @IsOptional()
  @IsString()
  @Length(2, 80)
  country?: string;

  @IsOptional()
  @IsBoolean()
  isCritical?: boolean;
}
