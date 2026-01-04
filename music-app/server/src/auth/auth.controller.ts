import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Şimdilik guard yok, bir sonraki adımda JWT Guard ekleyip burayı kilitleyeceğiz
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: any) {
  const user = await this.usersService.findById(req.user.id);

  return {
    id: user.id,
    username: user.username, // 🔥 DB’den geliyor
    role: user.userType.name,
  };
}


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin-only')
  adminOnly() {
    return { ok: true, message: 'only admin can see this' };
  }
}
