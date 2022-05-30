import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { throws } from 'assert';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { multerOptions } from 'src/lib/multerOptions';
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
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBody({ type: CreateBoardDto })
  @UseInterceptors(FilesInterceptor('images', null, multerOptions))
  // FilesInterceptor 첫번째 매개변수: formData의 key값,
  // 두번째 매개변수: 파일 최대 갯수
  // 세번째 매개변수: 파일 설정 (위에서 작성했던 multer 옵션들)
  async createBoard(
    @Req() req,
    @UploadedFiles() files: File[],
  ): Promise<Board> {
    const board = req.body;
    const user = await this.userService.findByAddress(req.user.address);
    return this.boardService.createBoard(board, user, files);
  }

  @Get('/:location')
  async getAllBoard(@Param('location') location: string): Promise<Board[]> {
    return await this.boardService.getAllBoard(location);
  }

  @Get('/:id')
  async getOneBoard(@Param('id') id: number): Promise<Board> {
    return await this.boardService.getOneBoard(id);
  }
}
