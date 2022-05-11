import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User
  ): Promise<Board> {
    const { ...result } = createBoardDto;
    const lookup = 0;
    const board = this.boardRepository.create({
      lookup,
      writer: user,
      ...result,
    });
    await this.boardRepository.save(board);
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
