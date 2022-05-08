import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from './board.entity';

@Entity('image')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'blob', nullable: true })
  file: Buffer;

  @ManyToOne((type) => Board, (board) => board.image, { eager: false })
  board: Board;
}
