import { Subscriber } from 'rxjs';
import * as Socket from 'ws';

import { Aggregate } from '../binanse/objects/aggregate';
import { PriceAnalysis } from './analyses/price.analysis';

export class AnalysisService {
  protected intervals = [];
  protected isSalesPricesInit = false;
  protected isBuysPricesInit = false;
  public priceCurrent = new PriceAnalysis();
  public priceInSecond = new PriceAnalysis();
  public priceInFiveSeconds = new PriceAnalysis();
  public priceInFifteenSeconds = new PriceAnalysis();
  public priceInThirtySeconds = new PriceAnalysis();
  public priceInMinute = new PriceAnalysis();

  constructor(protected readonly io: Socket, protected observer: Subscriber<any>) {
    this.init();
  }

  protected init() {
    this.io.on('message', (data) => {
      const aggregate = new Aggregate(JSON.parse(data as string));
      this.priceCurrent.fillValue(aggregate.isBuyerMarketMaker, aggregate.price, aggregate.quantity);
      this.initPrices();
      this.observer.next(this);
    });

    this.io.on('error', (err) => {
      this.observer.error(err);
    });

    this.io.on('close', () => {
      this.observer.complete();
    });
  }

  //TODO: fix links from parent vale
  protected initPrices() {
    if (this.isSalesPricesInit && this.isBuysPricesInit) return;
    const second = 1000;
    const priceStorages = [
      { storage: this.priceInSecond, interval: second },
      { storage: this.priceInFiveSeconds, interval: 5 * second },
      { storage: this.priceInFifteenSeconds, interval: 15 * second },
      { storage: this.priceInThirtySeconds, interval: 30 * second },
      { storage: this.priceInMinute, interval: 60 * second },
    ];

    priceStorages.forEach(({ storage }) => {
      const bPrice = this.priceCurrent.buysPrice;
      const bVolume = this.priceCurrent.buysSummaryVolume;
      const sPrice = this.priceCurrent.salesPrice;
      const sVolume = this.priceCurrent.salesSummaryVolume;
      storage.fillValue(true, bPrice, bVolume);
      storage.fillValue(false, sPrice, sVolume);
    });
    if (this.priceCurrent.salesPrice > 0) this.isSalesPricesInit = true;
    if (this.priceCurrent.buysPrice > 0) this.isBuysPricesInit = true;
    if (!this.isSalesPricesInit || !this.isBuysPricesInit) return;

    this.intervals.push(
      ...priceStorages.map(({ storage, interval }) => {
        return setInterval(() => {
          const bPrice = this.priceCurrent.buysPrice;
          const bVolume = this.priceCurrent.buysSummaryVolume;
          const sPrice = this.priceCurrent.salesPrice;
          const sVolume = this.priceCurrent.salesSummaryVolume;
          storage.fillValue(true, bPrice, bVolume);
          storage.fillValue(false, sPrice, sVolume);
        }, interval);
      }),
    );
  }
}
