import { NextFunction, Request, Response } from "express";
import { Transaction, UpdateOptions } from "sequelize";
import { database } from "./../config/database";
import * as ErrorHandler from "./../utils/error_handler";
import { HTTP404Error } from "./../utils/error_handler";
import * as ProductService from "../service/product";
import { Product, ProductAttribute } from "../models/product";
import { HTTP400Error } from "../utils/http_errors";
import { Stock, StockAttribute } from "../models/stock";
import {
  ProductCategory,
  ProductCategoryAttribute,
} from "../models/product_category";

interface createCategoryRequest {
  categoryName: string;
}
interface createProductRequest {
  name: string;
  description?: string;
  categoryId: number;
  imagePath?: string;
}

interface createBranchProductRequest {
  productId: number;
  price: number;
  quantity: number;
  isRecommend?: boolean;
  status?: string;
}

interface updateBranchProductRequest {
  price?: number;
  quantity?: number;
  isRecommend?: boolean;
  status?: string;
}

interface bulkCreateProductRequest {
  products: createProductRequest[];
}

interface bulkCreateBranchProductRequest {
  products: createBranchProductRequest[];
}

export const createProduct = async (
  req: Request<any, any, createProductRequest>,
  res: Response,
  next: NextFunction
) => {
  if (req)
    try {
      if (!req.body) {
        throw new HTTP400Error("parameter is required");
      }
      let bodyParam = req.body;

      if (!bodyParam.name) {
        throw new HTTP400Error("product name is required");
      }
      if (!bodyParam.categoryId) {
        throw new HTTP400Error("category is required");
      }

      database
        .transaction<Product>(async (t: Transaction) => {
          let productParam: ProductAttribute = {
            ...bodyParam,
          };

          return ProductService.createProduct(productParam, { transaction: t });
        })
        .then((product: Product) => {
          res.status(200).json(product);
        })
        .catch((err: Error) => {
          ErrorHandler.handleAll(err, res, next);
        });
    } catch (err: any) {
      ErrorHandler.handleAll(err, res, next);
    }
};

export const createProductCategory = async (
  req: Request<any, any, createCategoryRequest>,
  res: Response,
  next: NextFunction
) => {
  if (req)
    try {
      if (!req.body) {
        throw new HTTP400Error("parameter is required");
      }
      let bodyParam = req.body;

      if (!bodyParam.categoryName) {
        throw new HTTP400Error("category name is required");
      }

      database
        .transaction<ProductCategory>(async (t: Transaction) => {
          let categoryParam: ProductCategoryAttribute = {
            ...bodyParam,
          };

          return ProductService.createProductCategory(categoryParam, {
            transaction: t,
          });
        })
        .then((product: ProductCategory) => {
          res.status(200).json(product);
        })
        .catch((err: Error) => {
          ErrorHandler.handleAll(err, res, next);
        });
    } catch (err: any) {
      ErrorHandler.handleAll(err, res, next);
    }
};

export const createBranchProduct = async (
  req: Request<{ branchId: number }, any, createBranchProductRequest>,
  res: Response,
  next: NextFunction
) => {
  if (req)
    try {
      if (!req.body) {
        throw new HTTP404Error("parameter is required");
      }
      let bodyParam = req.body;

      if (!bodyParam.productId) {
        throw new HTTP400Error("product id is required");
      }
      if (!bodyParam.price) {
        throw new HTTP400Error("product price is required");
      }
      if (!bodyParam.quantity) {
        throw new HTTP400Error("product quantity is required");
      }

      database
        .transaction(async (t: Transaction) => {
          let productParam: StockAttribute = {
            ...{ ...bodyParam, branchId: req.params.branchId },
          };

          return ProductService.createBranchProduct(productParam, {
            transaction: t,
          });
        })
        .then((product) => {
          res.status(200).json(product);
        })
        .catch((err: Error) => {
          ErrorHandler.handleAll(err, res, next);
        });
    } catch (err: any) {
      ErrorHandler.handleAll(err, res, next);
    }
};

export const bulkCreateProduct = async (
  req: Request<any, any, bulkCreateProductRequest>,
  res: Response,
  next: NextFunction
) => {
  if (req)
    try {
      if (!req.body) {
        throw new HTTP404Error("parameter is required");
      }
      let bodyParam = req.body;

      if ((bodyParam?.products?.length ?? 0) === 0) {
        throw new HTTP404Error("product is required");
      }

      database
        .transaction<Product[]>(async (t: Transaction) => {
          let productParam: ProductAttribute[] = [];
          Object.assign(productParam, bodyParam.products);

          return ProductService.bulkCreateProduct(productParam, {
            transaction: t,
          });
        })
        .then((products: Product[]) => {
          res.status(200).json(products);
        })
        .catch((err: Error) => {
          ErrorHandler.handleAll(err, res, next);
        });
    } catch (err: any) {
      ErrorHandler.handleAll(err, res, next);
    }
};

export const bulkCreateBranchProduct = async (
  req: Request<{ branchId: number }, any, bulkCreateBranchProductRequest>,
  res: Response,
  next: NextFunction
) => {
  if (req)
    try {
      if (!req.body) {
        throw new HTTP404Error("parameter is required");
      }
      if (!req.params.branchId) {
        throw new HTTP404Error("branch id is required");
      }
      let products = req.body.products.map((product) => {
        return { ...product, branchId: req.params.branchId };
      });

      if ((products.length ?? 0) === 0) {
        throw new HTTP404Error("product is required");
      }

      database
        .transaction<Stock[]>(async (t: Transaction) => {
          let productParam: StockAttribute[] = [];
          Object.assign(productParam, products);

          return ProductService.bulkCreateBranchProduct(productParam, {
            transaction: t,
          });
        })
        .then((products) => {
          res.status(200).json(products);
        })
        .catch((err: Error) => {
          ErrorHandler.handleAll(err, res, next);
        });
    } catch (err: any) {
      ErrorHandler.handleAll(err, res, next);
    }
};

export const updateProduct = async (
  req: Request<{ productId: number }, any, ProductAttribute>,
  res: Response,
  next: NextFunction
) => {
  try {
    let bodyParam: ProductAttribute = { ...req.body, id: req.params.productId };
    database
      .transaction(async (t: Transaction) => {
        let updateOptions: UpdateOptions<Product> = {
          where: { id: bodyParam.id },
          transaction: t,
        };
        return ProductService.updateProduct(bodyParam, updateOptions);
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
export const deleteProduct = async (
  req: Request<{ productId: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params || !req.params.productId) {
      throw new HTTP404Error("parameter is required");
    }

    let id = req.params.productId;
    database
      .transaction(async (t: Transaction) => {
        return ProductService.deleteProduct(id, t);
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

export const getProduct = async (
  req: Request<any, any, ProductAttribute>,
  res: Response,
  next: NextFunction
) => {
  let bodyParam = req.body;
  try {
    let cashList = await ProductService.getProduct({
      where: {
        ...(bodyParam.id && { id: bodyParam.id }),
        ...(bodyParam.name && { name: bodyParam.name }),
        ...(bodyParam.categoryId && { categoryId: bodyParam.categoryId }),
      },
    });

    return res.json({ cashList });
  } catch (err: any) {
    ErrorHandler.handleAll(err, res, next);
  }
};

export const getProductByBranch = async (
  req: Request<{ branchId: number }, any, any, { productId?: number }>,
  res: Response,
  next: NextFunction
) => {
  let branchId = req.params.branchId;
  let productId = req.query.productId;
  try {
    if (!branchId) {
      throw new HTTP400Error("branch id is required");
    }
    let products = await ProductService.getProductByBranch(branchId, productId);

    return res.json({ products });
  } catch (err: any) {
    ErrorHandler.handleAll(err, res, next);
  }
};

export const updateProductBranch = async (
  req: Request<{ stockId: number }, any, StockAttribute>,
  res: Response,
  next: NextFunction
) => {
  try {
    const stockId = req.params.stockId;

    if (!stockId) {
      throw new HTTP400Error("branch id is required");
    }

    await ProductService.updateBranchProduct(req.body, {
      where: { id: stockId },
    });

    return res.json({ status: "success" });
  } catch (err: any) {
    ErrorHandler.handleAll(err, res, next);
  }
};
