import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique, CreateDateColumn, JoinColumn, Column } from "typeorm";
import { User } from "../users/user.entity";
import { Song } from "../songs/song.entity";

@Entity("favorites")
@Unique(["userId", "songId"])
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  songId: number;

  @ManyToOne(() => User, (u) => u.favorites, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Song, { onDelete: "CASCADE" })
  @JoinColumn({ name: "songId" })
  song: Song;

  @CreateDateColumn()
  createdAt: Date;
}
