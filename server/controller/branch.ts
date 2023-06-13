import { NextFunction, Request, Response } from "express";
import { Op, Transaction, UpdateOptions } from "sequelize";
import { database } from "./../config/database";
import * as ErrorHandler from "./../utils/error_handler";
import { HTTP404Error } from "./../utils/error_handler";
import {
  Branch,
  BranchAttribute,
  CreateBranchRequestBody,
} from "../models/branch";
import * as BranchService from "../service/branch";
import * as CashBranchService from "../service/cash_branch";
import {
  CashBranch,
  CashBranchAttribute,
  CashStockItem,
} from "../models/cash_branch";
import { HTTP400Error } from "../utils/http_errors";
import { Cash } from "../models/cash";

interface updateCashBranchRequest {
  cashId: number;
  amount: number;
  isReturnable?: boolean;
  isActive?: boolean;
}

export const createBranch = async (
  req: Request<any, CreateBranchRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    let reqBody: CreateBranchRequestBody = req.body;
    database
      .transaction<Branch>(async (t: Transaction) => {
        let branchParam: BranchAttribute = { branchName: reqBody.branchName };

        return BranchService.createBranch(branchParam, { transaction: t });
      })
      .then((branch: Branch) => {
        res.status(200).json(branch);
      })
      .catch((err: Error) => {
        ErrorHandler.handleAll(err, res, next);
      });
  } catch (err: any) {
    ErrorHandler.handleAll(err, res, next);
  }
};
export const updateBranch = async (
  req: Request<{ branchId: number }, any, BranchAttribute>,
  res: Response,
  next: NextFunction
) => {
  try {
    let branchParam: BranchAttribute = { ...req.body, id: req.params.branchId };
    database
      .transaction(async (t: Transaction) => {
        let updateOptions: UpdateOptions<Branch> = {
          where: { id: branchParam.id },
          transaction: t,
        };
        return BranchService.updateBranch(branchParam, updateOptions);
      })
      .then(() => {
        res.status(200).json({ message: "success" });
      })
      .catch((err: Error) => {
        ErrorHandler.handleAll(err, res, next);
      });
  } catch (err: any) {
    ErrorHandler.handleAll(err, res, next);
  }
};
export const deleteBranch = async (
  req: Request<{ branchId: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    let id = req.params.branchId;
    database
      .transaction(async (t: Transaction) => {
        return BranchService.deleteBranch(id, t);
      })
      .then((branch: Branch[]) => {
        res.status(200).json({ message: "success", deletedBranch: branch });
      })
      .catch((err: Error) => {
        ErrorHandler.handleAll(err, res, next);
      });
  } catch (err: any) {
    ErrorHandler.handleAll(err, res, next);
  }
};

export const getBranch = async (
  req: Request<{ branchId: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    let { rows, count } = await BranchService.getAllBranch();

    return res.json({ branchList: rows, count });
  } catch (err: any) {
    ErrorHandler.handleAll(err, res, next);
  }
};

export const getCashStock = async (
  req: Request<{ branchId: number }>,
  res: Response,
  next: NextFunction
) => {
  if (!req.params.branchId) {
    throw new HTTP404Error("branch id is required");
  }
  try {
    let cashStock = await CashBranchService.getReturnCashStock(
      req.params.branchId
    );

    return res.json({ cashStockItems: cashStock });
  } catch (err: any) {
    ErrorHandler.handleAll(err, res, next);
  }
};

export const updateCashStock = async (
  req: Request<{ branchId: number }, any, updateCashBranchRequest>,
  res: Response,
  next: NextFunction
) => {
  if (req)
    try {
      let bodyParam = req.body;
      let branchId = req.params.branchId;

      if ((await Branch.findOne({ where: { id: branchId } })) == null) {
        throw new HTTP400Error("branch id not found");
      }
      if ((await Cash.findOne({ where: { id: bodyParam.cashId } })) == null) {
        throw new HTTP400Error("cash id not found");
      }
      database
        .transaction(async (t: Transaction) => {
          let cashBranchRow = await CashBranch.findOne({
            where: { branchId: branchId, cashId: bodyParam.cashId },
          });
          if (cashBranchRow === null) {
            return CashBranchService.createCashBranch(
              { ...bodyParam, branchId },
              {
                transaction: t,
              }
            );
          } else {
            let [_, rows] = await CashBranchService.updateCashBranch(
              { ...bodyParam, branchId },
              {
                transaction: t,
                where: {
                  branchId: branchId,
                  cashId: bodyParam.cashId,
                },
                returning: true,
              }
            );
            return rows[0];
          }
        })
        .then((cashBranch: CashBranch) => {
          res.status(200).json({ message: "success", row: cashBranch });
        })
        .catch((err: Error) => {
          ErrorHandler.handleAll(err, res, next);
        });
    } catch (err) {
      ErrorHandler.handleAll(err, res, next);
    }
};

export const bulkUpdateCashStock = async (
  req: Request<{ branchId: number }, any, updateCashBranchRequest[]>,
  res: Response,
  next: NextFunction
) => {
  if (req)
    try {
      let bodyParam = req.body;
      let branchId = req.params.branchId;

      if ((await Branch.findOne({ where: { id: branchId } })) == null) {
        throw new HTTP400Error("branch id not found");
      }
      if (!bodyParam) {
        throw new HTTP400Error("cash not found");
      }
      database
        .transaction(async (t: Transaction) => {
          let returnRow = [];
          for (const param of bodyParam) {
            let cashBranchRow = await CashBranch.findOne({
              where: { branchId: branchId, cashId: param.cashId },
            });
            if (cashBranchRow === null) {
              const cash = await CashBranchService.createCashBranch(
                { ...param, branchId: branchId },
                {
                  transaction: t,
                }
              );

              returnRow.push(cash);
            } else {
              let [_, rows] = await CashBranchService.updateCashBranch(
                { ...param, branchId: branchId },
                {
                  transaction: t,
                  where: {
                    branchId: branchId,
                    cashId: param.cashId,
                  },
                  returning: true,
                }
              );
              returnRow.push(rows[0]);
            }
          }
          return returnRow;
        })
        .then((cashBranch) => {
          res.status(200).json({ message: "success", row: cashBranch });
        })
        .catch((err: Error) => {
          ErrorHandler.handleAll(err, res, next);
        });
    } catch (err) {
      ErrorHandler.handleAll(err, res, next);
    }
};
