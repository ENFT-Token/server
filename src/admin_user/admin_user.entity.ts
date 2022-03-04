import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AdminUser {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  nickname: string;

  @PrimaryColumn()
  email: string;

  @Column()
  password: string;

  @Column()
  address: string;
}
