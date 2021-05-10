import * as cfg from 'config';

export class PriceAnalysis {
  protected sales: number[] = [];
  protected buys: number[] = [];
  protected salesVolume: number[] = [];
  protected buysVolume: number[] = [];
  protected salesDifference: number[] = [];
  protected buysDifference: number[] = [];

  protected prettierPrice(value: number, currency = 100000) {
    return Math.round(value * currency) / currency;
  }

  protected clear(array: number[]) {
    if (array.length > cfg.get<number>('analysis.price.maxLength')) array.splice(0, 1);
  }

  /**
   * Very fast sum strategy
   */
  protected calculateSum(value: number[]) {
    let sum = 0;
    for (let i = value.length; i--; ) {
      sum += value[i];
    }

    return sum;
  }

  fillValue(isBuyer: boolean, price: number, volume: number) {
    const beforeMiddlePrice = isBuyer ? this.buysPrice : this.salesPrice;
    const arrayPrice = isBuyer ? this.buys : this.sales;
    const arrayVolume = isBuyer ? this.buysVolume : this.salesVolume;
    const arrayDifference = isBuyer ? this.buysDifference : this.salesDifference;
    arrayPrice.push(price);
    arrayVolume.push(volume);
    this.clear(arrayPrice);
    this.clear(arrayVolume);
    const afterMiddlePrice = isBuyer ? this.buysPrice : this.salesPrice;
    if (beforeMiddlePrice) arrayDifference.push(afterMiddlePrice - beforeMiddlePrice);
    this.clear(arrayDifference);
  }

  get salesPrice() {
    const rawPrice = this.calculateSum(this.sales) / this.sales.length || 0;

    return this.prettierPrice(rawPrice);
  }

  get salesSummaryVolume() {
    const raw = this.calculateSum(this.salesVolume) / this.salesVolume.length || 0;

    return this.prettierPrice(raw);
  }

  get salesPriceDifference() {
    const raw = this.calculateSum(this.salesDifference) / this.salesDifference.length || 0;

    return this.prettierPrice(raw);
  }

  get buysPrice() {
    const rawPrice = this.calculateSum(this.buys) / this.buys.length || 0;

    return this.prettierPrice(rawPrice);
  }

  get buysSummaryVolume() {
    const raw = this.calculateSum(this.buysVolume) / this.buysVolume.length || 0;

    return this.prettierPrice(raw);
  }

  get buysPriceDifference() {
    const raw = this.calculateSum(this.buysDifference) / this.buysDifference.length || 0;

    return this.prettierPrice(raw);
  }
}
