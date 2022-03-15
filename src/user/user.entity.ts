import { Board } from 'src/community/board/board.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  nickname: string;

  @PrimaryColumn()
  email: string;

  @Column()
  password: string;

  @Column()
  location: string;

  @CreateDateColumn()
  createAt: Date;
  
  @UpdateDateColumn()
  updateAt: Date;

  @Column()
  isAdmin: boolean;

  @OneToMany(
    type => Board,
    board => board.writer
  )
  board: Board[];
}
