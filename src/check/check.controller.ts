import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CheckDto, PlaceDto } from './dto/check.dto';
import { CheckService } from './check.service';
import { JwtAuthGuardForAdmin } from '../auth/jwt-auth.guard';
import { IAdminJwt } from '../admin/admin.controller';

@Controller('check')
export class CheckController {
  constructor(private checkService: CheckService) {}

  @ApiOperation({
    summary: '체크인/아웃',
  })
  @UseGuards(JwtAuthGuardForAdmin)
  @Post('/')
  async check(
    @Req() { user }: { user: IAdminJwt },
    @Body() checkDto: CheckDto,
  ) {
    const { address, nftToken } = checkDto;
    return this.checkService.check(user.address, address, nftToken);
  }

  @ApiOperation({
    summary: '현재 헬스장 체크인 유저 리스트',
  })
  @UseGuards(JwtAuthGuardForAdmin)
  @Get('/')
  async allCheckUesr(@Req() { user }: { user: IAdminJwt }) {
    return this.checkService.allCheckInUser(user.place);
  }

  @ApiOperation({
    summary: '오늘 헬스장 체크인 명 수',
  })
  @UseGuards(JwtAuthGuardForAdmin)
  @Get('/today_count')
  async todayCount(@Req() { user }: { user: IAdminJwt }) {
    const count = await this.checkService.todayCount(user.place);
    return {
      place: user.place,
      count,
    };
  }

  @ApiOperation({
    summary: '한달 헬스장 가입자 명 수',
  })
  @Get('/month_minting')
  async monthMinting(@Req() { user }: { user: IAdminJwt }) {
    const count = await this.checkService.randomMonthCount(30);
    return count;
  }

  @ApiOperation({
    summary: '한달 헬스장 체크인 명 수',
  })
  @Get('/month_count')
  async monthCheckin(@Req() { user }: { user: IAdminJwt }) {
    const count = await this.checkService.randomMonthCount(0);
    return count;
  }

  @ApiOperation({
    summary: '현재 헬스장 체크인 명 수',
  })
  @UseGuards(JwtAuthGuardForAdmin)
  @Get('/count')
  async count(@Req() { user }: { user: IAdminJwt }) {
    const count = await this.checkService.count(user.place);
    return {
      place: user.place,
      count,
    };
  }
}
