import {
  BulkCreateOptions,
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Op,
  Transaction,
  UpdateOptions,
} from "sequelize";
import { select } from "../config/database";
import { STATUS } from "../const";
import { Stock, StockAttribute } from "../models/stock";
import {
  Product,
  ProductAttribute,
  productByBranchItem,
} from "../models/product";
import {
  ProductCategory,
  ProductCategoryAttribute,
} from "../models/product_category";

export const getProduct = (
  params: FindOptions<ProductAttribute>
): Promise<Product[] | null> => {
  return Product.findAll<Product>(params);
};

export const getProductByBranch = async (
  branchId: number,
  productId?: number
): Promise<productByBranchItem[]> => {
  let additionalWhereClause = "";
  if (!!productId) {
    additionalWhereClause += ` and p.id = '${productId}'`;
  }

  const query = `
    SELECT 
        s.id, 
        s."productId",
        s.price,
        s.status,
        s."isRecommend",
        s.quantity,
        p.name,
        p.description,
        p."categoryId",
        pc."categoryName",
        p."imagePath"
    FROM stock s 
    LEFT JOIN product p 
        ON p."id" = s."productId" 
    LEFT JOIN product_category pc
        ON p."categoryId" = pc.id
    WHERE s."branchId" = :branchId 
        and s.status = :status
        ${additionalWhereClause}
    ORDER BY s.price desc`;
  return await select(query, {
    replacements: {
      branchId,
      productId: productId,
      status: STATUS.ACTIVE,
    },
  });
};

export const findOrCreateProduct = (params: FindOptions) => {
  return Product.findOrCreate<Product>(params);
};

export const getAllProduct = (
  params: FindOptions
): Promise<{ rows: Product[]; count: number }> => {
  return Product.findAndCountAll(params);
};

export const createProduct = (
  params: ProductAttribute,
  option?: CreateOptions
): Promise<Product> => {
  if (option) return Product.create<Product>(params, option);
  else return Product.create<Product>(params);
};

export const createProductCategory = (
  params: ProductCategoryAttribute,
  option?: CreateOptions
): Promise<ProductCategory> => {
  if (option) return ProductCategory.create<ProductCategory>(params, option);
  else return ProductCategory.create<ProductCategory>(params);
};

export const bulkCreateProduct = (
  params: ProductAttribute[],
  option?: BulkCreateOptions
): Promise<Product[]> => {
  if (option) return Product.bulkCreate<Product>(params, option);
  else return Product.bulkCreate<Product>(params);
};

export const createBranchProduct = (
  params: StockAttribute,
  option?: CreateOptions
): Promise<Stock> => {
  if (option) return Stock.create<Stock>(params, option);
  else return Stock.create<Stock>(params);
};

export const bulkCreateBranchProduct = (
  params: StockAttribute[],
  option?: BulkCreateOptions
): Promise<Stock[]> => {
  if (option) return Stock.bulkCreate<Stock>(params, option);
  else return Stock.bulkCreate<Stock>(params);
};

export const updateProduct = (
  params: ProductAttribute,
  option: UpdateOptions
) => {
  return Product.update(params, option);
};

export const updateBranchProduct = (
  params: StockAttribute,
  option: UpdateOptions
) => {
  return Stock.update(params, option);
};

export const bulkUpdateBranchProduct = (
  params: StockAttribute[],
  option: BulkCreateOptions<StockAttribute>
) => {
  return Stock.bulkCreate(params, {
    ...option,

    updateOnDuplicate: ["quantity", "price", "status", "isRecommend"],
  });
};

export const deleteProduct = async (
  productId: number,
  t: Transaction
): Promise<void> => {
  const params: StockAttribute = {
    status: STATUS.DELETED,
  };

  if (
    (await Stock.findOne({
      where: { productId },
      transaction: t,
    })) === null
  ) {
    Product.destroy({ where: { id: productId }, transaction: t });
  } else
    await Stock.update(params, {
      where: { productId },
      fields: ["status"],
      returning: true,
      transaction: t,
    });
};
