import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Song } from '../songs/song.entity';

@Entity('genres')
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  // 🔁 Many-to-Many'nin diğer ucu
  @ManyToMany(() => Song, (song) => song.genres)
  songs: Song[];
}
