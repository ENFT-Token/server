import { ApiProperty } from '@nestjs/swagger';
import { Board } from 'src/community/board/board.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  @ApiProperty()
  address: string | null;

  @Column()
  @ApiProperty()
  privateKey: string | null;

  @Column({ unique: true })
  @ApiProperty()
  nickname: string;

  @Column()
  @ApiProperty()
  location: string;

  @Column()
  @ApiProperty()
  profile: string;

  @Column()
  @ApiProperty()
  sex: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @OneToMany((type) => Board, (board) => board.writer)
  @ApiProperty()
  board: Board[];
}

@Entity()
export class Approve {
  @PrimaryColumn()
  @ApiProperty()
  address: string;

  @Column()
  @ApiProperty()
  requestDay: number;

  @Column()
  @ApiProperty()
  requestIdentityName: string;
}
