import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Artist } from '../artists/artist.entity';
import { Song } from '../songs/song.entity';

@Entity('albums')
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'int', nullable: true })
  year?: number;

  @ManyToOne(() => Artist, (artist) => artist.albums, { onDelete: 'CASCADE' })
  artist: Artist;

  @OneToMany(() => Song, (song) => song.album)
  songs: Song[];
}
