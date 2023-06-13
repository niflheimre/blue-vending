import { Model } from "sequelize";

export interface TransactionAttribute {
  id?: number;
  stockId?: number;
  branchId?: number;
  status?: string;
}

export class Transaction
  extends Model<TransactionAttribute>
  implements TransactionAttribute
{
  public id!: number;
  public stockId!: number;
  public branchId!: number;
  public status!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
