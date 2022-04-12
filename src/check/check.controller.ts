import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiOperation } from '@nestjs/swagger';
import { CheckDto, PlaceDto } from "./dto/check.dto";
import { CheckService } from './check.service';
import { JwtAuthGuardForAdmin } from "../auth/jwt-auth.guard";
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

  @Get('/count')
  async count(@Query() { place }: PlaceDto) {
    const count = await this.checkService.count(place);
    return {
      place,
      count,
    };
  }
}
