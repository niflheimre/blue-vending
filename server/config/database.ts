import sequelize, { FindOptions, Sequelize, Transaction } from "sequelize";
import { makeReadReplica, makeWriteReplica } from "../utils/database_healper";
import { writeSequelizeFile } from "../utils/logging_sequelize";
import { initialModel } from "./initial_model";
let database: Sequelize;

database = new Sequelize(
  `postgres://${process.env.DATABASE_USERNAME1 || ""}:${
    process.env.DATABASE_PASSWORD1 || ""
  }@postgres-docker:5432/${process.env.DATABASE_NAME1 || ""}`,
  {
    host: "postgres-docker",
    dialect: "postgres",
    replication: {
      read: makeReadReplica(),
      write: makeWriteReplica(),
    },
    logging: (str) => {
      writeSequelizeFile(str);
    },
    pool: {
      max: process.env.DATABASE_POOL_MAX
        ? Number(process.env.DATABASE_POOL_MAX)
        : undefined,
      min: process.env.DATABASE_POOL_MIN
        ? Number(process.env.DATABASE_POOL_MIN)
        : undefined,
      idle: process.env.DATABASE_POOL_IDLE
        ? Number(process.env.DATABASE_POOL_IDLE)
        : undefined,
      acquire: process.env.DATABASE_POOL_ACQUIRE
        ? Number(process.env.DATABASE_POOL_ACQUIRE)
        : undefined,
    },
  }
);

initialModel(database);

database
  .sync({
    force: false,
    alter: process.env.DATABASE_ALTER === "true" ? true : false,
  })
  .then(() => {
    console.log("sync");
  })
  .catch((err) => {
    console.log(err);
  });

type opts = {
  transaction?: Transaction;
};

const select = <T extends object>(query: string, options: FindOptions = {}) => {
  return database.query<T>(query, {
    type: sequelize.QueryTypes.SELECT,
    transaction: options.transaction,
    replacements: options.replacements,
  });
};
const rawQuery = (query: string, options: FindOptions = {}) => {
  return database.query(query, {
    type: sequelize.QueryTypes.RAW,
    transaction: options.transaction,
    replacements: options.replacements,
  });
};
const insert = (query: string, options: opts = {}) => {
  return database.query(query, {
    type: sequelize.QueryTypes.INSERT,
    transaction: options.transaction,
  });
};
const update = (query: string, options: opts = {}) => {
  return database.query(query, {
    type: sequelize.QueryTypes.UPDATE,
    transaction: options.transaction,
  });
};

const connectToDatabase = async () => {
  try {
    await database.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { database, select, rawQuery, insert, update, connectToDatabase };
