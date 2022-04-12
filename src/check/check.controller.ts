import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CheckDto } from './dto/check.dto';
import { CheckService } from './check.service';
@Controller('check')
export class CheckController {
  constructor(private checkService: CheckService) {}

  @ApiOperation({
    summary: '체크인/아웃',
  })
  @Post('/')
  async check(@Body() checkDto: CheckDto) {
    const { address, nftToken } = checkDto;
    return this.checkService.check(address, nftToken);
  }
}
