import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from './board.entity';
import {Blob} from 'buffer';
@Entity('image')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("blob", { nullable: true })
  image: Blob;

  @ManyToOne((type) => Board, (board) => board.image, { eager: false })
  board: Board;
}
