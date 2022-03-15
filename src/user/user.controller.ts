import { Body, Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
    ){}

    @Get()
    checkDuplicate(@Body() dupDataCheck){
        if(dupDataCheck.email){
            return this.userService.findEmail(dupDataCheck.email);
        }else if(dupDataCheck.nickname){
            return this.userService.findNickname(dupDataCheck.nickname);
        }
    }
}
