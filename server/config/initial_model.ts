import moment from "moment";
import { DataTypes, Sequelize } from "sequelize";
import { Branch } from "../models/branch";
import { Product } from "../models/product";
import { Stock } from "../models/stock";
import { Transaction } from "../models/transaction";
import { STATUS, TRANSACTION_STATUS } from "../const";
import { Cash } from "../models/cash";
import { CashBranch } from "../models/cash_branch";
import { ProductCategory } from "../models/product_category";

export const initialModel = (database: Sequelize) => {
  Branch.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      branchName: { type: DataTypes.STRING, allowNull: false },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: STATUS.ACTIVE,
      },
    },
    {
      tableName: "branch",
      schema: process.env.DATABASE_SCHEMA || undefined,
      sequelize: database,
    }
  );

  Cash.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: "cash",
      schema: process.env.DATABASE_SCHEMA || undefined,
      sequelize: database,
      timestamps: false,
    }
  );

  CashBranch.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      branchId: { type: DataTypes.INTEGER, allowNull: false },
      cashId: { type: DataTypes.INTEGER, allowNull: false },
      amount: { type: DataTypes.INTEGER, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
      isReturnable: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      tableName: "cash_branch",
      schema: process.env.DATABASE_SCHEMA || undefined,
      sequelize: database,
    }
  );

  Product.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      imagePath: { type: DataTypes.STRING },
    },
    {
      tableName: "product",
      schema: process.env.DATABASE_SCHEMA || undefined,
      sequelize: database,
    }
  );

  ProductCategory.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      categoryName: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "product_category",
      schema: process.env.DATABASE_SCHEMA || undefined,
      sequelize: database,
      timestamps: false,
    }
  );

  Stock.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      branchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productId: { type: DataTypes.INTEGER, allowNull: false },
      price: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: STATUS.ACTIVE,
      },
      isRecommend: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "stock",
      schema: process.env.DATABASE_SCHEMA || undefined,
      sequelize: database,
    }
  );

  Transaction.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      stockId: { type: DataTypes.INTEGER, allowNull: false },
      branchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: TRANSACTION_STATUS.FAILED,
      },
    },
    {
      tableName: "transaction",
      schema: process.env.DATABASE_SCHEMA || undefined,
      sequelize: database,
    }
  );

  //Association
  Product.hasMany(Stock, {
    foreignKey: "productId",
  });
  ProductCategory.hasMany(Product, {
    foreignKey: "categoryId",
  });
  Branch.hasMany(Stock, {
    foreignKey: "branchId",
  });
  Branch.hasMany(CashBranch, {
    foreignKey: "branchId",
  });
  Cash.hasMany(CashBranch, {
    foreignKey: "cashId",
  });
  Stock.hasMany(Transaction, {
    foreignKey: "stockId",
  });
  Branch.hasMany(Transaction, {
    foreignKey: "branchId",
  });
};
