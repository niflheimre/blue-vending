import { ConnectionOptions } from "sequelize";

export type changeIds = { destroyIds: number[]; createIds: number[] };
export type changeUserIds = { destroyIds: string[]; createIds: string[] };

export const makeReadReplica = () => {
  let readReplica: ConnectionOptions[] = [];
  let isLoop = true;
  let idx = 1;
  while (isLoop) {
    if (!process.env["DATABASE_HOST" + idx]) isLoop = false;
    else {
      readReplica.push({
        database: process.env["DATABASE_NAME" + idx],
        port: process.env["DATABASE_PORT" + idx]
          ? parseInt(process.env["DATABASE_PORT" + idx] ?? "")
          : 5432,
        host: process.env["DATABASE_HOST" + idx] ?? "",
        username: process.env["DATABASE_USERNAME" + idx] ?? "",
      });
      idx++;
    }
  }
  return readReplica;
};

export const makeWriteReplica = () => {
  let writeReplica: ConnectionOptions = {};
  if (process.env["DATABASE_HOST1"])
    writeReplica = {
      database: process.env["DATABASE_NAME1"],
      port: process.env["DATABASE_PORT1"]
        ? parseInt(process.env["DATABASE_PORT1"] ?? "")
        : 5432,
      host: process.env["DATABASE_HOST1"] ?? "",
      username: process.env["DATABASE_USERNAME1"] ?? "",
    };
  return writeReplica;
};
