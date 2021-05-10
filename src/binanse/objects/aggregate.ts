import { Expose } from 'class-transformer';

import { AggregateInterfaces } from '../interfaces/aggregate.interfaces';

export class Aggregate {
  constructor(protected readonly obj: AggregateInterfaces) {}

  @Expose()
  get eventType() {
    return this.obj.e;
  }

  @Expose()
  get eventTime() {
    return this.obj.E;
  }

  @Expose()
  get eventDate() {
    return new Date(this.obj.E);
  }

  @Expose()
  get symbol() {
    return this.obj.s;
  }

  @Expose()
  get aggregateTraderId() {
    return this.obj.a;
  }

  @Expose()
  get price() {
    return parseFloat(this.obj.p);
  }

  @Expose()
  get quantity() {
    return parseFloat(this.obj.q);
  }

  @Expose()
  get firstTraderId() {
    return this.obj.f;
  }

  @Expose()
  get lastTraderId() {
    return this.obj.l;
  }

  @Expose()
  get tradeTime() {
    return this.obj.T;
  }

  @Expose()
  get tradeDate() {
    return new Date(this.obj.T);
  }

  @Expose()
  get isBuyerMarketMaker() {
    return this.obj.m;
  }

  @Expose()
  get ignore() {
    return this.obj.M;
  }
}
