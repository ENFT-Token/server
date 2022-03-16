import { Body, Controller, Get } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserEmailDto, UserNicknameDto } from './dto/create-user.dto';
import { UserService } from './user.service';


@Controller('user')
@ApiTags('유저 관련 API')
export class UserController {
    constructor(
        private userService: UserService,
    ){}

    @Get('/nickname')
    @ApiOperation({summary: 'nickname 중복체크 API'})
    @ApiBody({type:UserNicknameDto})
    checNicknamekDuplicate(@Body() nickname:UserNicknameDto): Promise<{usable:boolean, message:string}>{
        return this.userService.findNickname(nickname);
    }

    @Get('/email')
    @ApiOperation({summary: 'email 중복체크 API'})
    @ApiBody({type:UserEmailDto})
    checkEmailDuplicate(@Body() email:UserEmailDto): Promise<{usable:boolean, message:string}>{
        return this.userService.findEmail(email);
    }
}
