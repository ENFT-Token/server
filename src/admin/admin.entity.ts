import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';

@Entity()
export class Admin {
  @Column()
  @ApiProperty()
  location: string;

  @Column({ unique: true })
  @ApiProperty({ description: '헬스장 상호명' })
  place: string;

  @PrimaryColumn()
  @ApiProperty()
  address: string;

  @Column({ unique: true })
  @ApiProperty()
  phone: string;

  @Column({ unique: true })
  @ApiProperty()
  nickname: string;

  @Column()
  @ApiProperty({ nullable: true })
  cover_img: string;

  @ManyToMany((type) => User, (user) => user.address)
  @JoinTable({
    joinColumn: {
      name: 'place',
      referencedColumnName: 'place',
    },
  })
  @ApiProperty({ description: '체크인/체크아웃 유저' })
  user: User[];
}

@Entity()
export class PriceInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({ description: '헬스장 상호명' })
  place: string;

  @Column()
  @ApiProperty({ description: '설정할 달' })
  month: number;

  @Column('decimal', { precision: 5, scale: 2 })
  @ApiProperty({ description: '설정할 클레이튼' })
  klay: number;
}
