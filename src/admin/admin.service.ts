import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { CaverService } from 'src/caver/caver.service';

@Injectable()
export class AdminService {
  constructor(private readonly caverService: CaverService) {}

  async mint(
    targetAddress: string,
    myAddress: string,
    location: string,
    day: number,
    secretKey: string,
  ) {
    const token = jwt.sign(
      {
        place: location,
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().add(day, 'days').format('YYYY-MM-DD'),
      },
      secretKey,
      {
        expiresIn: `${day}d`,
      },
    );

    // from은 관리자 지갑이여야하고
    // 돈은 다른 사람이 내야함
    // 수수료 대납 구현

    const _mintNFT = await this.caverService.contract.methods
      .mintNFT(targetAddress, token)
      .send({
        from: myAddress,
        gas: 3000000,
        feeDelegation: true,
        feePayer: this.caverService.feeKeyring.address,
      });
    return _mintNFT;
  }
}
