import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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

  @Column()
  @ApiProperty()
  identityName: string;

  @Column({ unique: true })
  @ApiProperty()
  address: string | null;

  @Column({ unique: true })
  @ApiProperty()
  privateKey: string | null;
}
