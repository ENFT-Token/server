import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import Caver, { AbiItem, Contract, Keyring, Keystore } from 'caver-js';
import { ConfigService } from '@nestjs/config';
import ABI from './contract.abi.json';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Wallet } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CaverService implements OnModuleInit {
  caver: Caver;
  contract: Contract;
  feeKeyring: Keyring;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  allWallet() {
    return this.walletRepository.find();
  }

  async onModuleInit() {
    this.caver = new Caver(this.configService.get('KLAYTN_NETWORK_URL'));
    const keystore = fs.readFileSync('./keystore.json', 'utf8');

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
