import { IsIn, IsString } from 'class-validator';
import { PasswordDto } from './password.dto';

export class RegisterDto extends PasswordDto {
  @IsString()
  username: string;

  @IsString()
  @IsIn(['admin', 'listener', 'artist'])
  roleName: 'admin' | 'listener' | 'artist';
}
