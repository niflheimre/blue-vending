import { Model } from "sequelize";

export interface BranchAttribute {
  id?: number;
  branchName?: string;
  status?: string;
}

export class Branch extends Model<BranchAttribute> implements BranchAttribute {
  public id!: number;
  public branchName!: string;
  public status!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export interface CreateBranchRequestBody {
  branchName: string;
}
