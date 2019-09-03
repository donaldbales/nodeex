import { Connection, ConnectionConfig, ConnectionError } from 'tedious';
import * as tds from 'tedious';

import { inspect } from './inspect';

const moduleName: string = 'sql';

export function connect(logger: any): Promise<any> {
  const methodName: string = 'connect';
  logger.info({ moduleName, methodName }, `Starting...`);

  return new Promise((resolve, reject) => {
    const sixtyMinutes: number = 60 * 60 * 1000;
    const database: string = (process.env.SQLSERVER_DATABASE as string) || '';
    const password: string = (process.env.SQLSERVER_PASSWORD as string) || '';
    const server: string = (process.env.SQLSERVER_SERVER as string) || '';
    const userName: string = (process.env.SQLSERVER_USERNAME as string) || '';
    const connectionConfig: ConnectionConfig = {
      options: {
        connectTimeout: sixtyMinutes,
        database,
        // If you're on Windows Azure, you will need this:
        encrypt: true,
        requestTimeout: sixtyMinutes
      },
      password,
      server,
      userName
    };

    const connection: Connection = new Connection(connectionConfig);

    connection.on('connect', (err: any) => {
      if (err) {
        logger.info({ moduleName, methodName, err });
        return reject(err);
      } else {
        return resolve(connection);
      }
    });
  });
}

export function executeDDL(logger: any, conn: any, sql: string): Promise<any> {
  const methodName: string = 'executeDDL';
  logger.info({ moduleName, methodName }, `Starting...`);

  return new Promise((resolve, reject) => {
    const results: any[] = [];

    if (sql) {
      const sqlRequest = new tds.Request(
        sql,
        (sqlerr: any, rowCount: any) => {
          if (sqlerr) {
            logger.error({ moduleName, methodName, sqlerr });
            return reject(sqlerr);
          } else {
            logger.debug({ moduleName, methodName, rowCount });
          }
        });

      logger.debug({ moduleName, methodName, sql });

      sqlRequest.on('row', (columns: any) => {
        logger.debug({ moduleName, methodName }, `on row...`);
        results.push({ value: columns[0].value });
      });

      sqlRequest.on('requestCompleted', (rowCount: any, more: any, rows: any) => {
        logger.debug({ moduleName, methodName }, `on requestCompleted...`);
        return resolve(results);
      });

      conn.execSql(sqlRequest);
    } else {
      resolve(results);
    }
  });
}

export function executeDML(logger: any, conn: any, sql: string, params: any[]): Promise<any> {
  const methodName: string = 'executeDML';
  logger.info({ moduleName, methodName }, `Starting...`);

  return new Promise((resolve, reject) => {
    const results: any[] = [];
    let rowsAffected: number = 0;

    if (sql) {
      const sqlRequest = new tds.Request(
        sql,
        (sqlerr: any, rowCount: any) => {
          if (sqlerr) {
            logger.error({ moduleName, methodName, sqlerr });
            return reject(sqlerr);
          } else {
            rowsAffected = rowCount;
            logger.debug({ moduleName, methodName, rowCount });
          }
        });

      logger.info({ moduleName, methodName }, `Starting...`);
      logger.info(`${moduleName}, ${methodName}: sql=\n${sql}`);

      if (params &&
          params.length > 0) {
        for (const param of params) {
          sqlRequest.addParameter(param[0], tds.TYPES.VarChar, param[1]);
        }
      }

      sqlRequest.on('row', (columns: any) => {
        logger.debug({ moduleName, methodName }, `on row...`);
        // let i: number = 0;
        const result: any = {};
        for (const column of columns) {
          logger.trace({ moduleName, methodName }, `column_name=${column.metadata.colName}`);
          logger.trace({ moduleName, methodName }, `value=${inspect(column.value)}`);
          logger.trace({ moduleName, methodName }, `javascript type=${typeof column.value}`);
          logger.trace({ moduleName, methodName }, `tds type=${column.metadata.type.name}`);
          let value: any;

          switch (column.metadata.type.name) {
          case 'BigInt':
            value = column.value !== null ? column.value.toString() : null;
            break;
          case 'BitN':
            value = column.value !== null ? column.value : null;
            break;
          case 'Date':
            value = column.value !== null ? new Date(column.value.toString()) : null;
            break;
          case 'DateTime2':
            value = column.value !== null ? new Date(column.value.toString()) : null;
            break;
          case 'DateTimeOffset':
            value = column.value !== null ? new Date(column.value.toString()) : null;
            break;
          case 'DecimalN':
            value = column.value !== null ? column.value.toString() : null;
            break;
          case 'FloatN':
            value = column.value !== null ? column.value : null;
            break;
          case 'IntN':
            value = column.value !== null ? column.value.toString() : null;
            break;
          case 'NumericN':
            value = column.value !== null ? column.value.toString() : null;
            break;
          case 'NVarChar':
            value = column.value !== null ? column.value.toString() : null;
            break;
          case 'VarChar':
            value = column.value !== null ? column.value.toString() : null;
            break;
          default:
            value = column.value !== null ? column.value.toString() : null;
            logger.error({ moduleName, methodName },
              `Unsupported data type: ` +
              `column name=${column.metadata.colName}, ` +
              `tds type=${column.metadata.type.name}`);
          }
          result[column.metadata.colName] = value;
        }
        results.push(result);
      });

      sqlRequest.on('requestCompleted', (rowCount: any, more: any, rows: any) => {
        logger.debug({ moduleName, methodName }, `on requestCompleted...`);
        if (results.length === 0) {
          results.push({ rowsAffected });
        }
        return resolve(results);
      });

      conn.execSql(sqlRequest);
    } else {
      resolve(results);
    }
  });
}
