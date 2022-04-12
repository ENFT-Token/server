import {
  Column,
  Entity, JoinTable, ManyToMany,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn
} from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';

@Entity()
export class Admin {
  @PrimaryColumn()
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  password: string;

  @Column()
  @ApiProperty()
  location: string;

  @Column({ unique: true })
  @ApiProperty({ description: '헬스장 상호명' })
  place: string;

  @Column({ unique: true })
  @ApiProperty()
  address: string;

  @Column({ unique: true })
  @ApiProperty()
  privateKey: string;

  @ManyToMany((type) => User, (user) => user.address)
  @JoinTable({
    joinColumn: {
      name: 'place',
      referencedColumnName: 'place',
    },
  })
  user: User[];
}
