import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryColumn()
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  address: string;
}
