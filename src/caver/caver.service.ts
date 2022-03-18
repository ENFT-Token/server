import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import Caver, { AbiItem, Contract, Keystore } from 'caver-js';
import { ConfigService } from '@nestjs/config';
import ABI from './contract.abi.json';

@Injectable()
export class CaverService implements OnModuleInit {
  caver: Caver;
  contract: Contract;
  keyring: any;
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.caver = new Caver(this.configService.get('KLAYTN_NETWORK_URL'));
    const keystore = fs.readFileSync('./keystore.json', 'utf8');

    // Decrypt keystore
    const keyring = this.caver.wallet.keyring.decrypt(
      keystore as any,
      this.configService.get('KAS_PASSWORD'),
    );
    console.log(keyring);
    this.keyring = keyring;
    // Add to caver.wallet
    this.caver.wallet.add(keyring);

    this.contract = new this.caver.contract(
      ABI as AbiItem[],
      this.configService.get('CONTRACT_ADDRESS'),
    );
  }
}
