import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Op,
  Transaction,
  UpdateOptions,
} from "sequelize";
import { select } from "../config/database";
import {
  Branch,
  BranchAttribute,
  CreateBranchRequestBody,
} from "../models/branch";
import { STATUS } from "../const";

export const getBranch = (params: FindOptions): Promise<Branch | null> => {
  return Branch.findOne<Branch>(params);
};

export const findOrCreateBranch = (params: FindOptions) => {
  return Branch.findOrCreate<Branch>(params);
};

export const getAllBranch = (
  params?: FindOptions
): Promise<{ rows: Branch[]; count: number }> => {
  return Branch.findAndCountAll(params);
};

export const createBranch = (
  params: BranchAttribute,
  option?: CreateOptions
): Promise<Branch> => {
  if (option) return Branch.create<Branch>(params, option);
  else return Branch.create<Branch>(params);
};

export const updateBranch = (
  params: BranchAttribute,
  option: UpdateOptions
) => {
  return Branch.update(params, option);
};

//Delete
export const deleteBranch = async (
  branchId: number,
  t: Transaction
): Promise<Branch[]> => {
  const params: BranchAttribute = {
    status: STATUS.DELETED,
  };
  const [_, rows] = await Branch.update(params, {
    where: { id: branchId },
    fields: ["status"],
    returning: true,
    transaction: t,
  });
  return rows;
};
