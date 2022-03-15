import { Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { UserService } from 'src/user/user.service';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';

@Controller('board')
export class BoardController {
    constructor(
        private boardService: BoardService,
        private userService: UserService
    ){}

    @Post()
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    async createBoard(
        @Req() req
    ): Promise<Board>{
        const board = req.body
        const user = await this.userService.findOneByEmail(req.user.email);
        return this.boardService.createBoard(board, user);
    }

    @Get()
    async getAllBoard(): Promise<Board[]>{
        return await this.boardService.getAllBoard();
    }

    
}
