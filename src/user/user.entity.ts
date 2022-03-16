import { ApiProperty } from '@nestjs/swagger';
import { Board } from 'src/community/board/board.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  @ApiProperty()
  nickname: string;

  @PrimaryColumn()
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  password: string;

  @Column()
  @ApiProperty()
  location: string;

  @CreateDateColumn()
  createAt: Date;
  
  @UpdateDateColumn()
  updateAt: Date;

  @Column()
  @ApiProperty()
  isAdmin: boolean;

  @OneToMany(
    type => Board,
    board => board.writer
  )
  @ApiProperty()
  board: Board[];
}
