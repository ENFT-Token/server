import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { Image } from './image.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>
  ) {}

  async createBoard(
    data,
    user: User
  ): Promise<Board> {
    const { title, image, content, location, cost } = data;
    const lookup = 0;
    const board = this.boardRepository.create({
      lookup,
      writer: user,
      title,
      content,
      location,
      cost
    });
    await this.boardRepository.save(board);
    image.forEach(async element => {
      const new_img = await this.imageRepository.create({
        image: element,
        board,
      })
      await this.imageRepository.save(new_img)
    });


    return board;
  }

  async getOneBoard(id: number): Promise<Board> {
    const board = await this.boardRepository.findOne(id);
    return board;
  }
  

  async getAllBoard(): Promise<Board[]> {
    const boards = await this.boardRepository.find();
    return boards;
  }
}
