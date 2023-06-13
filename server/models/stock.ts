import { Model } from "sequelize";

export interface StockAttribute {
  id?: number;
  branchId?: number;
  productId?: number;
  price?: number;
  status?: string;
  isRecommend?: boolean;
  quantity?: number;
}

export class Stock extends Model<StockAttribute> implements StockAttribute {
  public id!: number;
  public branchId!: number;
  public productId!: number;
  public price!: number;
  public status!: string;
  public isRecommend?: boolean;
  public quantity!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}