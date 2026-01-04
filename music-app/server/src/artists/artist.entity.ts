import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Album } from '../albums/album.entity';
import { User } from 'src/users/user.entity';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true, unique: true })
  userId?: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE', // 🔥 USER silinirse ARTIST de silinir
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ nullable: true })
  country?: string;

  @Column({ default: false })
  isCritical: boolean;

  @OneToMany(() => Album, (album) => album.artist)
  albums: Album[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
