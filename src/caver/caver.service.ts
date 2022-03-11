import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import Caver from 'caver-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CaverService implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const caver = new Caver('https://api.baobab.klaytn.net:8651/');
    const keystore = fs.readFileSync('./keystore.json', 'utf8');

    // Decrypt keystore
    const keyring = caver.wallet.keyring.decrypt(
      keystore as any,
      this.configService.get('KAS_PASSWORD'),
    );
    console.log(keyring);

    // Add to caver.wallet
    caver.wallet.add(keyring);
  }
}
