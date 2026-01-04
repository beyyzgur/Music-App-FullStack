import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserType } from './user-type.entity';
import { Favorite } from '../favorites/favorite.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @ManyToOne(() => UserType, (type) => type.users)
  @JoinColumn({ name: 'user_type_id' })
  userType: UserType;

  @OneToMany(() => Favorite, (f) => f.user)
  favorites: Favorite[];
}
