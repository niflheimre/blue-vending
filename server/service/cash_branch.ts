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
  CashBranch,
  CashBranchAttribute,
  CashStockItem,
} from "../models/cash_branch";
import { STATUS } from "../const";

export const getCashBranch = (
  params: FindOptions
): Promise<CashBranch | null> => {
  return CashBranch.findOne<CashBranch>(params);
};

export const findOrCreateCashBranch = (params: FindOptions) => {
  return CashBranch.findOrCreate<CashBranch>(params);
};

export const getAllCashBranch = (
  params: FindOptions
): Promise<{ rows: CashBranch[]; count: number }> => {
  return CashBranch.findAndCountAll(params);
};

export const getReturnCashStock = async (
  branchId: number
): Promise<CashStockItem[]> => {
  const query = `
    SELECT cb.id, c.type, c.value, cb.amount, c.id as "cashId" 
    FROM cash_branch cb 
    LEFT JOIN "cash" c 
        ON c."id" = cb."cashId" 
    WHERE cb."branchId" = :branchId and cb."isActive" = true and cb."isReturnable" = true 
    ORDER BY c.value desc`;
  return await select(query, {
    replacements: {
      branchId,
    },
  });
};

export const createCashBranch = (
  params: CashBranchAttribute,
  option?: CreateOptions
): Promise<CashBranch> => {
  if (option) return CashBranch.create<CashBranch>(params, option);
  else return CashBranch.create<CashBranch>(params);
};

export const updateCashBranch = (
  params: CashBranchAttribute,
  option: UpdateOptions<CashBranchAttribute>
) => {
  return CashBranch.update(params, { ...option, returning: true });
};

//Delete
export const deleteCashBranch = async (
  cashId: number,
  branchId: number,
  t: Transaction
): Promise<CashBranch[]> => {
  const params: CashBranchAttribute = {
    isActive: false,
  };
  const [_, rows] = await CashBranch.update(params, {
    where: { cashId: cashId, branchId: branchId },
    fields: ["isActive"],
    returning: true,
    transaction: t,
  });
  return rows;
};

export const deleteCashAllBranch = async (
  cashId: number,
  branchId: number,
  t: Transaction
): Promise<CashBranch[]> => {
  const params: CashBranchAttribute = {
    isActive: false,
  };
  const [_, rows] = await CashBranch.update(params, {
    where: { cashId: cashId },
    fields: ["isActive"],
    returning: true,
    transaction: t,
  });
  return rows;
};

export const calculateCashChange = async (
  branchId: number,
  returnAmount: number
): Promise<CashStockItem[] | undefined> => {
  if (!branchId) return undefined;
  if (returnAmount === 0) return [];

  try {
    let cashBranch = await getReturnCashStock(branchId);
    let changeableAmount = cashBranch.reduce((prev, cur) => {
      return (prev += cur.amount * cur.value);
    }, 0);

    console.log(changeableAmount);
    let balance = returnAmount;
    if (changeableAmount < balance) return undefined;
    let returnList: CashStockItem[] = [];

    for (var i = 0; balance > 0 && i <= cashBranch.length; i++) {
      const returnQt = Math.min(
        (balance / cashBranch[i].value) | 0,
        cashBranch[i].amount
      );
      const returnAmount = returnQt * cashBranch[i].value;
      if (balance - returnAmount >= 0) {
        balance -= returnAmount;
        returnList.push({ ...cashBranch[i], amount: returnQt });
      } else {
        continue;
      }
    }
    
    return returnList;
  } catch (err: any) {
    return undefined;
  }
};
