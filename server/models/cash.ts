import { Model } from "sequelize";

export interface CashAttribute {
  id?: number;
  type?: string;
  value?: number;
}

export class Cash extends Model<CashAttribute> implements CashAttribute {
  public id!: number;
  public type!: string;
  public value!: number;
}


