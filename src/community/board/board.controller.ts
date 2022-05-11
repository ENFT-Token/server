import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';

@ApiTags('게시판 API')
@Controller('board')
export class BoardController {
  constructor(
    private boardService: BoardService,
    private userService: UserService,
  ) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBody({ type: CreateBoardDto })
  async createBoard(@Req() req): Promise<Board> {
    const board = req.body;
    const user = await this.userService.findByNickName(req.user.nickname);
    return this.boardService.createBoard(board, user);
  }

  @Get()
  async getAllBoard(): Promise<Board[]> {
    return await this.boardService.getAllBoard();
  }

  @Get('/:id')
  async getOneBoard(@Param('id') id: number): Promise<Board> {
    return await this.boardService.getOneBoard(id);
  }
}
