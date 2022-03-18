import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, JwtAuthGuardForAdmin } from 'src/auth/jwt-auth.guard';
import { CaverService } from 'src/caver/caver.service';
import { UserService } from 'src/user/user.service';
import { MintDto } from './dto/admin.dto';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { ApiOperation } from '@nestjs/swagger';

interface IUser {
  email: string;
  nickname: string;
}

@Controller('admin')
export class AdminController {
  constructor(
    private readonly userService: UserService,
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

    const token = jwt.sign(
      {
        place: location,
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().add(mint.day, 'days').format('YYYY-MM-DD'),
      },
      password,
      {
        expiresIn: `${mint.day}d`,
      },
    );

    // from은 관리자 지갑이여야하고
    // 돈은 다른 사람이 내야함
    // 수수료 대납 구현

    const _mintNFT = await this.caverService.contract.methods
      .mintNFT(mint.target, token)
      .send({
        from: address,
        gas: 3000000,
        feeDelegation: true,
        feePayer: this.caverService.feeKeyring.address,
      });
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
}
