import { Injectable } from '@nestjs/common';
import * as cfg from 'config';
import { Observable } from 'rxjs';
import * as ws from 'ws';

import { AnalysisService } from './analysis.service';

@Injectable()
export class AnalysisRegister {
  constructor() {
    this.register().then((data) =>
      data.subscribe((data) => {
        const price = data.priceInFiveSeconds;
        console.log('Покупают: ', price.buysPrice, price.buysPriceDifference, price.buysSummaryVolume);
        console.log('Продают: ', price.salesPrice, price.salesPriceDifference, price.salesSummaryVolume);
        console.log();
      }),
    );
  }

  public async register() {
    return new Promise<Observable<AnalysisService>>((res, rej) => {
      const url = `${cfg.get('websocket.host')}:${cfg.get('websocket.port')}/ws/dogebusd@aggTrade`;
      const socket = new ws(url);

      socket.on('error', (err) => {
        rej(err);
      });

      socket.on('open', () => {
        res(
          new Observable((sub) => {
            new AnalysisService(socket, sub);
          }),
        );
      });
    });
  }
}
