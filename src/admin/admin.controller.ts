import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, JwtAuthGuardForAdmin } from 'src/auth/jwt-auth.guard';
import { CaverService } from 'src/caver/caver.service';
import { UserService } from 'src/user/user.service';
import { MintDto } from './dto/admin.dto';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateApproveDto } from 'src/user/dto/create-approve.dto';

interface IUser {
  email: string;
  nickname: string;
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
  async _mint(@Req() { user }: { user: IUser }, @Body() mint: MintDto) {
    const { password, location } = await this.userService.findOneByEmail(
      user.email,
    );
    const { address } = await this.userService.findWallet(user.email);

    const _mintNFT = await this.adminService.mint(
      mint.target,
      address,
      location,
      mint.day,
      password,
    );
    return _mintNFT;
  }

  @ApiOperation({
    summary: '관리자가 소유한 멤버의 지갑 주소 API',
  })
  @UseGuards(JwtAuthGuardForAdmin)
  @Get('/memberAddress')
  async _member(@Req() { user }: { user: IUser }) {
    const { address } = await this.userService.findWallet(user.email);
    const owner = await this.caverService.contract.methods
      .ownerByMember()
      .call({
        from: address,
      });
    return owner;
  }

  @ApiOperation({
    summary: '유저가 관리자에게 보낸 승인 리스트',
  })
  @UseGuards(JwtAuthGuardForAdmin)
  @Get('/approve/list')
  async approveList(@Req() { user }: { user: IUser }) {
    const { location } = await this.userService.findOneByEmail(user.email);
    const list = await this.userService.findApprove({
      requestLocation: location,
    });
    return list;
  }

  @ApiOperation({
    summary: '유저 NFT 발급 승인',
  })
  @UseGuards(JwtAuthGuardForAdmin)
  @Post('/approve/complete')
  async approveComplete(
    @Req() { user }: { user: IUser },
    @Body() approve: CreateApproveDto,
  ) {
    const { password, location } = await this.userService.findOneByEmail(
      user.email,
    );
    const { address } = await this.userService.findWallet(user.email);
    const _mintNFT = await this.adminService.mint(
      approve.address,
      address,
      location,
      approve.requestDay,
      password,
    );
    await this.userService.approveComplete(approve);
    return _mintNFT;
  }
}
