import * as moment from 'moment';

import { PriceAnalysis } from './price.analysis';

class PriceAnalysisForTest extends PriceAnalysis {
  public salesT = this.sales;
  public buysT = this.buys;
  public salesDifferenceT = this.salesDifference;
  public buysDifferenceT = this.buysDifference;
  public salesVolumeT = this.salesVolume;
  public buysVolumeT = this.buysVolume;

  constructor() {
    super();
  }

  fillValue(isBuyer: boolean, price: number, volume: number) {
    return super.fillValue(isBuyer, price, volume);
  }
}

describe('PriceAnalysis', () => {
  it('should work', () => {
    const priceManager = new PriceAnalysisForTest();
    [
      {
        tradeDate: moment.utc('2020-02-01 14:13:20').toDate(),
        price: 1,
        quantity: 100,
      },
      {
        tradeDate: moment.utc('2020-02-01 14:13:20').toDate(),
        price: 2,
        quantity: 150,
      },
      {
        tradeDate: moment.utc('2020-02-01 14:13:21').toDate(),
        price: 3,
        quantity: 250,
      },
      {
        tradeDate: moment.utc('2020-02-01 14:13:21').toDate(),
        price: 4,
        quantity: 300,
      },
      {
        tradeDate: moment.utc('2020-02-01 14:13:21').toDate(),
        price: 5,
        quantity: 350,
      },
      {
        tradeDate: moment.utc('2020-02-01 14:13:21').toDate(),
        price: 6,
        quantity: 400,
      },
      {
        tradeDate: moment.utc('2020-02-01 14:13:21').toDate(),
        price: 7,
        quantity: 450,
      },
      {
        tradeDate: moment.utc('2020-02-01 14:13:21').toDate(),
        price: 4,
        quantity: 400,
        isBuyerMarketMaker: true,
      },
    ].forEach((el) => priceManager.fillValue(el.isBuyerMarketMaker, el.price, el.quantity));

    expect(priceManager.salesT.length).toEqual(5);

    expect(priceManager.buysT.length).toEqual(1);

    expect(priceManager.salesVolumeT.length).toEqual(5);
    expect(priceManager.salesDifferenceT.length).toEqual(5);

    expect(priceManager.buysVolumeT.length).toEqual(1);
    expect(priceManager.buysDifferenceT.length).toEqual(0);

    expect(priceManager.salesPrice).toEqual(5);
    expect(priceManager.salesSummaryVolume).toEqual(350);
    expect(priceManager.salesPriceDifference).toEqual(0.7);
    expect(priceManager.buysPrice).toEqual(4);
    expect(priceManager.buysSummaryVolume).toEqual(400);
    expect(priceManager.buysPriceDifference).toEqual(0);
  });
});
