import { NextFunction, Request, Response } from "express";
import { Transaction, UpdateOptions } from "sequelize";
import { database } from "./../config/database";
import * as ErrorHandler from "./../utils/error_handler";
import { HTTP404Error } from "./../utils/error_handler";
import * as CashService from "../service/cash";
import * as CashBranchService from "../service/cash_branch";
import * as StockTransactionService from "../service/transaction";
import { Cash, CashAttribute } from "../models/cash";
import { HTTP400Error, HTTPClientError } from "../utils/http_errors";
import { CashBranch, CashStockItem } from "../models/cash_branch";
import { updateBranchProduct } from "../service/product";
import { Stock } from "../models/stock";
import { TRANSACTION_STATUS } from "../const";

interface createTransactionRequest {
  stockId: number;
  branchId: number;
  cashIn: transactionCashItem[];
}

interface transactionCashItem {
  id: number;
  value: number;
  amount: number;
}

export const createTransaction = async (
  req: Request<any, any, createTransactionRequest>,
  res: Response,
  next: NextFunction
) => {
  if (req)
    try {
      if (!req.body) {
        throw new HTTP404Error("parameter is required");
      }
      let bodyParam = req.body;

      if (!bodyParam.stockId) {
        throw new HTTP404Error("stockId is required");
      }
      if (!bodyParam.branchId) {
        throw new HTTP400Error("branch id is required");
      }
      if (!bodyParam.cashIn || bodyParam.cashIn.length <= 0) {
        throw new HTTP400Error("invalid value");
      }

      let totalCash = bodyParam.cashIn.reduce((prev, cur) => {
        return (prev += cur.amount * cur.value);
      }, 0);

      const stockItem = await Stock.findOne({
        where: {
          id: bodyParam.stockId,
        },
      });

      if (!stockItem) throw new HTTP400Error("invalid stockId");
      const returnPrice = totalCash - stockItem!.price;

      const returnCash = await CashBranchService.calculateCashChange(
        bodyParam.branchId,
        returnPrice
      );

      if (!returnCash) throw new HTTP400Error("change insufficient");

      database
        .transaction(async (t: Transaction) => {
          stockItem.quantity--;
          stockItem.save({ transaction: t });

          let cashStock = await CashBranch.findAll({
            where: { branchId: bodyParam.branchId },
            transaction: t,
          });

          let cashStockMap: any = {};
          cashStock.forEach(
            (item) => (cashStockMap[item.cashId] = item.amount)
          );

          bodyParam.cashIn.forEach(
            (item) => (cashStockMap[item.id] += item.amount)
          );

          returnCash.forEach(
            (item) => (cashStockMap[item.cashId] -= item.amount)
          );

          const affectedRow = await Promise.all(
            cashStock.map((item) => {
              item.amount = cashStockMap[item.cashId];
              return item.save({ fields: ["amount"], transaction: t });
            })
          )
            .then((rows) => rows)
            .catch((e) => {
              throw e;
            });

          await StockTransactionService.createTransaction(
            {
              stockId: bodyParam.stockId,
              branchId: bodyParam.branchId,
              status: TRANSACTION_STATUS.SUCCESS,
            },
            { transaction: t }
          );

          return returnCash;
        })
        .then((returnCash) => {
          res.status(200).json(
            returnCash.map<transactionCashItem>((cash) => {
              return {
                id: cash.cashId,
                value: cash.value,
                amount: cash.amount,
              };
            })
          );
        })
        .catch((err: Error) => {
          ErrorHandler.handleAll(err, res, next);
        });
    } catch (err: any) {
      ErrorHandler.handleAll(err, res, next);
    }
};
