import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Album } from '../albums/album.entity';
import { ManyToMany, JoinTable } from 'typeorm';
import { Genre } from '../genres/genre.entity';

@Entity('songs')
@Index(['title', 'album'], { unique: true })
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  // saniye cinsinden
  @Column({ type: 'int', default: 0 })
  durationSec: number;

  // Albüm içi sıra
  @Column({ type: 'int', nullable: true })
  trackNo?: number;

  @ManyToOne(() => Album, (album) => album.songs, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  album: Album;

  @ManyToMany(() => Genre, (genre) => genre.songs, {
  cascade: true,
  })
  @JoinTable({
    name: 'song_genres',
  })
  genres: Genre[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
