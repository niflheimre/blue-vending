import {
  BulkCreateOptions,
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Op,
  Transaction,
  UpdateOptions,
  where,
} from "sequelize";
import { select } from "../config/database";
import { Cash, CashAttribute } from "../models/cash";
import { STATUS } from "../const";
import {
  CashBranch,
  CashBranchAttribute,
  CashStockItem,
} from "../models/cash_branch";
import { getReturnCashStock } from "./cash_branch";

export const getCash = (
  params: FindOptions<CashAttribute>
): Promise<Cash[] | null> => {
  return Cash.findAll<Cash>(params);
};

export const findOrCreateCash = (params: FindOptions) => {
  return Cash.findOrCreate<Cash>(params);
};

export const getAllCash = (
  params: FindOptions
): Promise<{ rows: Cash[]; count: number }> => {
  return Cash.findAndCountAll(params);
};

export const createCash = (
  params: CashAttribute,
  option?: CreateOptions
): Promise<Cash> => {
  if (option) return Cash.create<Cash>(params, option);
  else return Cash.create<Cash>(params);
};

export const bulkCreateCash = (
  params: CashAttribute[],
  option?: BulkCreateOptions
): Promise<Cash[]> => {
  if (option) return Cash.bulkCreate<Cash>(params, option);
  else return Cash.bulkCreate<Cash>(params);
};

export const updateCash = (params: CashAttribute, option: UpdateOptions) => {
  return Cash.update(params, option);
};

export const deleteCash = async (
  cashId: number,
  t: Transaction
): Promise<void> => {
  const params: CashBranchAttribute = {
    isActive: false,
  };

  if (
    (await CashBranch.findOne({ where: { cashId }, transaction: t })) === null
  ) {
    Cash.destroy({ where: { id: cashId }, transaction: t });
  } else
    await CashBranch.update(params, {
      where: { cashId: cashId },
      fields: ["isActive"],
      returning: true,
      transaction: t,
    });
};
