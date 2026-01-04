import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from './user-type.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(UserType)
    private readonly userTypeRepo: Repository<UserType>,
  ) {}

  async onModuleInit() {
    const requiredRoles = ['admin', 'listener', 'artist'];

    for (const name of requiredRoles) {
      const exists = await this.userTypeRepo.findOne({ where: { name } });

      if (!exists) {
        await this.userTypeRepo.save(this.userTypeRepo.create({ name }));
        this.logger.log(`Seeded role: ${name}`);
      }
    }
  }
}
