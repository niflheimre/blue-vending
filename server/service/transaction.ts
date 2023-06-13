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
  Transaction as StockTransaction,
  TransactionAttribute,
} from "../models/transaction";
import { TRANSACTION_STATUS } from "../const";

export const getTransaction = (
  params: FindOptions<TransactionAttribute>
): Promise<StockTransaction | null> => {
  return StockTransaction.findOne<StockTransaction>(params);
};

export const findOrCreateTransaction = (params: FindOptions) => {
  return StockTransaction.findOrCreate<StockTransaction>(params);
};

export const getAllTransaction = (
  params: FindOptions<TransactionAttribute>
): Promise<{ rows: StockTransaction[]; count: number }> => {
  return StockTransaction.findAndCountAll(params);
};

export const createTransaction = (
  params: TransactionAttribute,
  option?: CreateOptions
): Promise<StockTransaction> => {
    
  if (option) return StockTransaction.create<StockTransaction>(params, option);
  else return StockTransaction.create<StockTransaction>(params);
};

export const updateTransaction = (
  params: TransactionAttribute,
  option: UpdateOptions
) => {
  return StockTransaction.update(params, option);
};

