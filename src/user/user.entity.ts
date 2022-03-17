import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Board } from 'src/community/board/board.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryColumn()
  @ApiProperty()
  email: string;

  @Column({ nullable: true })
  @ApiProperty()
  address: string;
}

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

  @OneToOne(() => Wallet, (wallet) => wallet.email, { nullable: true })
  @JoinColumn({ name: 'email' })
  wallet: Wallet | null;

  @OneToMany((type) => Board, (board) => board.writer)
  @ApiProperty()
  board: Board[];
}
