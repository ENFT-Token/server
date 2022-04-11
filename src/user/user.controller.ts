import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CaverService } from 'src/caver/caver.service';
import { CreateApproveDto } from './dto/create-approve.dto';
import { UserNicknameDto } from './dto/create-user.dto';
import { UserService } from './user.service';

interface IUserJwt {
  address: string;
}

@Controller('user')
@ApiTags('유저 관련 API')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly caverService: CaverService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/nickname')
  @ApiOperation({ summary: 'nickname 중복체크 API' })
  @ApiBody({ type: UserNicknameDto })
  checNicknamekDuplicate(
    @Body() nickname: UserNicknameDto,
  ): Promise<{ usable: boolean; message: string }> {
    return this.userService.findNickname(nickname);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/myNft')
  @ApiOperation({ summary: 'user가 소유한 nft 출력' })
  async myNft(@Req() { user }: { user: IUserJwt }) {
    const { address } = user;
    console.log(address);
    if (!address) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: '"address" query is undefined',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    const balanceOf = await this.caverService.contract.methods
      .balanceOf(address)
      .call();

    const tokenIdxs = [];
    for (let i = 0; i < balanceOf; i++) {
      const tokenIdx = await this.caverService.contract.methods
        .tokenOfOwnerByIndex(address, i)
        .call();
      tokenIdxs.push(tokenIdx);
    }

    const nfts = [];
    for (let i = 0; i < tokenIdxs.length; i++) {
      const nft = await this.caverService.contract.methods
        .tokenURI(tokenIdxs[i])
        .call();
      nfts.push(nft);
    }

    return nfts;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/approve')
  @ApiOperation({ summary: 'user가 관리자한테 승인 요청' })
  async approve(
    @Req() { user }: { user: IUserJwt },
    @Body() approve: CreateApproveDto,
  ) {
    await this.userService.requestApprove({
      ...approve,
      address: user.address,
    });
    return {
      msg: '요청 완료',
    };
  }
}
