import { Controller, Get } from '@nestjs/common';
import { CaverService } from './caver.service';

// myNFT 내가 소유한 NFT > 유저 측 사용
// 지갑에서 보유한 NFT 찾기
// balanceOf 개수 찾기 for
// tokenOfOwnerByIndex로 실제 인덱스 찾기
// tokenURI로 가져오기

@Controller('caver')
export class CaverController {
  constructor(private readonly caverService: CaverService) {}

  @Get('/symbol')
  async getSymbol() {
    const response = await this.caverService.contract.methods.symbol().call();
    return response;
  }
}
