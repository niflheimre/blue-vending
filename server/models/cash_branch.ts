import { Model } from "sequelize";

export interface CashBranchAttribute {
  id?: number;
  branchId?: number;
  cashId?: number;
  amount?: number;
  isActive?: boolean;
  isReturnable?: boolean;
}

export class CashBranch
  extends Model<CashBranchAttribute>
  implements CashBranchAttribute
{
  public id!: number;
  public branchId!: number;
  public cashId!: number;
  public amount!: number;
  public isActive!: boolean;
  public isReturnable!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export interface CashStockItem {
  id: number;
  cashId: number;
  type: string;
  value: number;
  amount: number;
}

export interface CashBranchItem {
  id: number;
  cashId: number;
  type: string;
  value: number;
  amount: number;
}
