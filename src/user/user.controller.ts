import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CaverService } from 'src/caver/caver.service';
import { createImageURL, multerOptions } from 'src/lib/multerOptions';
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

  @Get('/nickname')
  @ApiOperation({ summary: 'nickname 중복체크 API' })
  @ApiBody({ type: UserNicknameDto })
  checNicknamekDuplicate(
    @Query() nickname: UserNicknameDto,
  ): Promise<{ usable: boolean; message: string }> {
    return this.userService.dupCheckNickName(nickname);
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

  @Post('/upload_profile')
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('images', multerOptions))
  async uploadProfile(@UploadedFile() file) {
    return `/public/${file.filename}`;
  }

  @Get('/healthList')
  @ApiOperation({ summary: '헬스장 가격표 리스트' })
  async healthList() {
    return await this.userService.findAllPriceInfo();
  }
}
