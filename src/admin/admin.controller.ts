import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuardForAdmin } from 'src/auth/jwt-auth.guard';
import { CaverService } from 'src/caver/caver.service';
import { UserService } from 'src/user/user.service';
import { MintDto } from './dto/admin.dto';

import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateApproveDtoWithAddress } from 'src/user/dto/create-approve.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { Repository } from 'typeorm';
import { PriceInfoDto } from './dto/priceInfo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/lib/multerOptions';

export interface IAdminJwt {
  address: string;
  place: string;
}

@Controller('admin')
export class AdminController {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly caverService: CaverService,
  ) {}

  @ApiOperation({
    summary: '민팅 API => 기간과 헬스장 정보담긴 JWT 스마트 컨트랙트에 전송',
  })
  @UseGuards(JwtAuthGuardForAdmin)
  @Post('/mint')
  async _mint(@Req() { user }: { user: IAdminJwt }, @Body() mint: MintDto) {
    const { place, address } = await this.adminService.findOneByAddress(
      user.address,
    );
    const _mintNFT = await this.adminService.mint(
      mint.target,
      address,
      place,
      mint.day,
      address,
    );
    return _mintNFT;
  }

  @ApiOperation({
    summary: '관리자가 소유한 멤버의 지갑 주소 API',
  })
  @UseGuards(JwtAuthGuardForAdmin)
  @Get('/memberAddress')
  async _member(@Req() { user }: { user: IAdminJwt }) {
    const { address } = user;
    const owner = await this.caverService.contract.methods
      .ownerByMember(address)
      .call();
    return owner;
  }

  @ApiOperation({
    summary: '유저가 관리자에게 보낸 승인 리스트',
  })
  @UseGuards(JwtAuthGuardForAdmin)
  @Get('/approve/list')
  async approveList(@Req() { user }: { user: IAdminJwt }) {
    const { place } = await this.adminService.findOneByAddress(user.address);
    const list = await this.userService.findApprove(place);
    return list;
  }

  @ApiOperation({
    summary: '유저 NFT 발급 승인',
  })
  @UseGuards(JwtAuthGuardForAdmin)
  @Post('/approve/complete')
  async approveComplete(
    @Req() { user }: { user: IAdminJwt },
    @Body() approve: CreateApproveDtoWithAddress,
  ) {
    const { place, address } = await this.adminService.findOneByAddress(
      user.address,
    );
    const _mintNFT = await this.adminService.mint(
      approve.address,
      address,
      place,
      approve.requestDay,
      address,
    );
    await this.userService.approveComplete(approve);
    return _mintNFT;
  }

  @ApiOperation({
    summary: '유저 NFT 발급 거절',
  })
  @UseGuards(JwtAuthGuardForAdmin)
  @Post('/approve/reject')
  async approveReject(
    @Req() { user }: { user: IAdminJwt },
    @Body() approve: CreateApproveDtoWithAddress,
  ) {
    await this.userService.approveComplete(approve);
    return {
      status: 'succ',
    };
  }

  @ApiOperation({
    summary: '관리자 가격 정보 확인',
  })
  @UseGuards(JwtAuthGuardForAdmin)
  @Get('/priceInfo')
  async getPriceInfo(@Req() { user }: { user: IAdminJwt }) {
    return await this.adminService.getPriceInfo(user.place);
  }

  @ApiOperation({
    summary: '관리자 가격 정보 추가',
  })
  @UseGuards(JwtAuthGuardForAdmin)
  @Post('/priceInfo')
  async addPriceInfo(
    @Req() { user }: { user: IAdminJwt },
    @Body() priceInfoDto: PriceInfoDto,
  ) {
    return await this.adminService.addPriceInfo(
      user.place,
      priceInfoDto.month,
      priceInfoDto.klay,
    );
  }

  @ApiOperation({
    summary: '관리자 가격 정보 삭제',
  })
  @UseGuards(JwtAuthGuardForAdmin)
  @Delete('/priceInfo')
  async deletePriceInfo(
    @Req() { user }: { user: IAdminJwt },
    @Body() priceInfoDto: PriceInfoDto,
  ) {
    return await this.adminService.deletePriceInfo(
      user.place,
      priceInfoDto.month,
    );
  }

  @ApiOperation({
    summary: '관리자 가격 정보 업데이트',
  })
  @UseGuards(JwtAuthGuardForAdmin)
  @Put('/priceInfo')
  async putPriceInfo(
    @Req() { user }: { user: IAdminJwt },
    @Body() priceInfoDto: PriceInfoDto,
  ) {
    return await this.adminService.updatePriceInfo(
      user.place,
      priceInfoDto.month,
      priceInfoDto.klay,
    );
  }

  @UseGuards(JwtAuthGuardForAdmin)
  @Post('/upload_cover')
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async uploadProfile(
    @Req() { user }: { user: IAdminJwt },
    @UploadedFile() file,
  ) {
    return this.adminService.updateCoverImg(
      user.address,
      `/public/${file.filename}`,
    );
  }
}
