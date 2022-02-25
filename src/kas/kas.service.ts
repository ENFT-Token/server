import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosRequestConfig, Method } from 'axios';
import { catchError, map } from 'rxjs/operators';
@Injectable()
export class KasService {
  constructor(private httpService: HttpService) {}

  sendRequest(method: Method, url: string, data?: any) {
    const baseURL = 'https://wallet-api.klaytnapi.com';
    const KAS_PUBLIC_ACCESS_KEY = process.env.KAS_PUBLIC_ACCESS_KEY;
    const KAS_PRIVATE_ACCESS_KEY = process.env.KAS_PRIVATE_ACCESS_KEY;
    const KAS_CHAIN_ID = process.env.KAS_CHAIN_ID;
    return this.httpService
      .request({
        method,
        baseURL,
        url,
        data: method !== 'GET' ? {} : data,
        params: method === 'GET' ? {} : data,
        headers: {
          'x-chain-id': KAS_CHAIN_ID,
          'Content-Type': 'application/json',
        },
        auth: {
          username: KAS_PUBLIC_ACCESS_KEY,
          password: KAS_PRIVATE_ACCESS_KEY,
        },
      })
      .pipe(map((response) => response.data))
      .pipe(
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }

  createAccount() {
    return this.sendRequest('POST', '/v2/account');
  }
}
