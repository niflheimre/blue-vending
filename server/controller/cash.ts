import { NextFunction, Request, Response } from "express";
import { Transaction, UpdateOptions } from "sequelize";
import { database } from "./../config/database";
import * as ErrorHandler from "./../utils/error_handler";
import { HTTP404Error } from "./../utils/error_handler";
import * as CashService from "../service/cash";
import { Cash, CashAttribute } from "../models/cash";
import { HTTP400Error } from "../utils/http_errors";

interface createCashRequest {
  type: string;
  value: number;
}

export const createCash = async (
  req: Request<any, any, createCashRequest>,
  res: Response,
  next: NextFunction
) => {
  if (req)
    try {
      if (!req.body) {
        throw new HTTP400Error("parameter is required");
      }
      let bodyParam = req.body;

      if (!bodyParam.type) {
        throw new HTTP400Error("cash type is required");
      }
      if (!bodyParam.value) {
        throw new HTTP400Error("cash value is required");
      }
      if (bodyParam.value <= 0) {
        throw new HTTP400Error("invalid value");
      }

      database
        .transaction<Cash>(async (t: Transaction) => {
          let cashParam: CashAttribute = {
            ...bodyParam,
          };

          return CashService.createCash(cashParam, { transaction: t });
        })
        .then((cash: Cash) => {
          res.status(200).json(cash);
        })
        .catch((err: Error) => {
          ErrorHandler.handleAll(err, res, next);
        });
    } catch (err: any) {
      ErrorHandler.handleAll(err, res, next);
    }
};

export const bulkCreateCash = async (
  req: Request<any, any, createCashRequest[]>,
  res: Response,
  next: NextFunction
) => {
  if (req)
    try {
      if (!req.body) {
        throw new HTTP400Error("parameter is required");
      }
      let bodyParam = req.body;

      if (!bodyParam || bodyParam.length <= 0) {
        throw new HTTP400Error("cash is required");
      }

      database
        .transaction<Cash[]>(async (t: Transaction) => {
          let cashParam: CashAttribute[] = [];
          Object.assign(cashParam, bodyParam);

          return CashService.bulkCreateCash(cashParam, { transaction: t });
        })
        .then((cash: Cash[]) => {
          res.status(200).json(cash);
        })
        .catch((err: Error) => {
          ErrorHandler.handleAll(err, res, next);
        });
    } catch (err: any) {
      ErrorHandler.handleAll(err, res, next);
    }
};

export const updateCash = async (
  req: Request<{ cashId: number }, any, CashAttribute>,
  res: Response,
  next: NextFunction
) => {
  try {
    let bodyParam: CashAttribute = { ...req.body, id: req.params.cashId };
    database
      .transaction(async (t: Transaction) => {
        let updateOptions: UpdateOptions<Cash> = {
          where: { id: bodyParam.id },
          transaction: t,
        };
        return CashService.updateCash(bodyParam, updateOptions);
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
export const deleteCash = async (
  req: Request<{ cashId: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    let id = req.params.cashId;
    database
      .transaction(async (t: Transaction) => {
        return CashService.deleteCash(id, t);
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

export const getCash = async (
  req: Request<any, any, CashAttribute>,
  res: Response,
  next: NextFunction
) => {
  let bodyParam = req.body;
  try {
    let cashList = await CashService.getCash({
      where: {
        ...(bodyParam.id && { id: bodyParam.id }),
        ...(bodyParam.type && { type: bodyParam.type }),
        ...(bodyParam.value && { value: bodyParam.value }),
      },
    });

    return res.json(cashList);
  } catch (err: any) {
    ErrorHandler.handleAll(err, res, next);
  }
};
