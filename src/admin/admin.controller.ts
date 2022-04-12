import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, JwtAuthGuardForAdmin } from 'src/auth/jwt-auth.guard';
import { CaverService } from 'src/caver/caver.service';
import { UserService } from 'src/user/user.service';
import { MintDto } from './dto/admin.dto';

import { ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateApproveDto, CreateApproveDtoWithAddress } from "src/user/dto/create-approve.dto";
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { Repository } from 'typeorm';

interface IAdminJwt {
  email: string;
}

@Controller('admin')
export class AdminController {
  constructor(
    @InjectRepository(Admin)
    private userRepository: Repository<Admin>,
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
    const { place, address, privateKey } =
      await this.adminService.findOneByEmail(user.email);
    const _mintNFT = await this.adminService.mint(
      mint.target,
      address,
      place,
      mint.day,
      privateKey,
    );
    return _mintNFT;
  }

  @ApiOperation({
    summary: '관리자가 소유한 멤버의 지갑 주소 API',
  })
  @UseGuards(JwtAuthGuardForAdmin)
  @Get('/memberAddress')
  async _member(@Req() { user }: { user: IAdminJwt }) {
    const { address } = await this.adminService.findOneByEmail(user.email);
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
  async approveList(@Req() { user }: { user: IAdminJwt }) {
    const { place } = await this.adminService.findOneByEmail(user.email);
    const list = await this.userService.findApprove({
      requestPlace: place,
    });
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
    const { place, address, privateKey } = await this.adminService.findOneByEmail(
      user.email,
    );
    const _mintNFT = await this.adminService.mint(
      approve.address,
      address,
      place,
      approve.requestDay,
      privateKey,
    );
    await this.userService.approveComplete(approve);
    return _mintNFT;
  }
}
