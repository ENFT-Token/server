import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CaverService } from 'src/caver/caver.service';
import { CreateApproveDto } from './dto/create-approve.dto';
import { UserEmailDto, UserNicknameDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('유저 관련 API')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly caverService: CaverService,
  ) {}

  @Get('/nickname')
  @ApiOperation({ summary: 'nickname 중복체크 API' })
  @ApiBody({ type: UserNicknameDto })
  checNicknamekDuplicate(
    @Body() nickname: UserNicknameDto,
  ): Promise<{ usable: boolean; message: string }> {
    return this.userService.findNickname(nickname);
  }

  @Get('/email')
  @ApiOperation({ summary: 'email 중복체크 API' })
  @ApiBody({ type: UserEmailDto })
  checkEmailDuplicate(
    @Body() email: UserEmailDto,
  ): Promise<{ usable: boolean; message: string }> {
    return this.userService.findEmail(email);
  }

  @Get('/myNft')
  @ApiOperation({ summary: 'user가 소유한 nft 출력' })
  async myNft(@Query() { address }: { address: string }) {
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

  @Post('/approve')
  @ApiOperation({ summary: 'user가 관리자한테 승인 요청' })
  async approve(@Body() approve: CreateApproveDto) {
    await this.userService.requestApprove(approve);
    return {
      msg: '요청 완료',
    };
  }
}
