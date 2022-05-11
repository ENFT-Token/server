import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createImageURL } from 'src/lib/multerOptions';
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
    user: User,
    files: File[]
  ): Promise<Board> {
    const { title, content, location, cost } = data;
    const lookup = 0;
    const generatedFiles: string[] = [];
    const board = this.boardRepository.create({
      lookup,
      writer: user,
      title,
      content,
      location,
      cost
    });
    await this.boardRepository.save(board);
    for (const file of files) {
      generatedFiles.push(createImageURL(file));
    }
    for(const file of generatedFiles){
      const new_img = await this.imageRepository.create({
        image: file,
        board
      })
      await this.imageRepository.save(new_img);
    }
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
