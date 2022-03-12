import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CaverService } from './caver.service';

// myNFT 내가 소유한 NFT > 유저 측 사용
// 지갑에서 보유한 NFT 찾기
// balanceOf 개수 찾기 for
// tokenOfOwnerByIndex로 실제 인덱스 찾기
// tokenURI로 가져오기

@Controller('caver')
export class CaverController {
  constructor(private readonly caverService: CaverService) {}

  @Get('/')
  Index() {
    return 'Hi Contract';
  }

  @Get('/symbol')
  async getSymbol() {
    const response = await this.caverService.contract.methods.symbol().call();
    return response;
  }

  @Get('/myNft')
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
}
