import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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
}
