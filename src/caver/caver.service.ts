import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import Caver, { AbiItem, Contract, Keyring, Keystore } from 'caver-js';
import { ConfigService } from '@nestjs/config';
import ABI from './contract.abi.json';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { Admin } from '../admin/admin.entity';

@Injectable()
export class CaverService implements OnModuleInit {
  caver: Caver;
  contract: Contract;
  feeKeyring: Keyring;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private configService: ConfigService,
  ) {}

  async allWallet() {
    const allAdmin = await this.adminRepository.find({
      select: ['address', 'privateKey'],
    });
    const allUser = await this.userRepository.find({
      select: ['address', 'privateKey'],
    });
    return [...allAdmin, ...allUser];
  }

  async onModuleInit() {
    this.caver = new Caver(this.configService.get('KLAYTN_NETWORK_URL'));
    const keystore = fs.readFileSync('./keystore.json', 'utf8');

    // const place = new PlaceCount();
    // place.place = 'ENFT 헬스장';
    // place.user = await this.userRepository.find({});
    //
    //
    // await this.placeCountRepository.save(place);
    //
    // const A = await this.placeCountRepository.findOne({ relations: ['user'], where: {
    //   place: 'ENFT 헬스장',
    //   }});
    // console.log(A);
    // ----- Test

    // Decrypt keystore
    const keyring = this.caver.wallet.keyring.decrypt(
      keystore as any,
      this.configService.get('KAS_PASSWORD'),
    );

    this.feeKeyring = keyring;
    // Add to caver.wallet
    this.caver.wallet.add(keyring);

    // 사용자 지갑도 키링에 추가
    const _wallet = await this.allWallet();
    console.log('all wallet', _wallet);
    _wallet.forEach((wallet) => {
      const keyring = new this.caver.wallet.keyring.singleKeyring(
        wallet.address,
        wallet.privateKey,
      );
      this.caver.wallet.add(keyring);
    });

    this.contract = new this.caver.contract(
      ABI as AbiItem[],
      this.configService.get('CONTRACT_ADDRESS'),
    );
  }
}
