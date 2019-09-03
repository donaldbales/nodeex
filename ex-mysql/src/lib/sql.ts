import * as mysql from 'mysql';

const moduleName: string = 'sql';

export function connect(logger: any): Promise<any> {
  const methodName: string = 'connect';
  logger.info({ moduleName, methodName }, `Starting...`);
  return new Promise((resolve, reject) => {
    const options: mysql.ConnectionConfig = {
      bigNumberStrings: true,
      connectTimeout: 60000,
      database: (process.env.MYSQL_DATABASE as string) || 'sys',
      host: undefined,
      password: (process.env.MYSQL_PASSWORD as string) || '',
      port: undefined,
      supportBigNumbers: true,
      user: (process.env.MYSQL_USER as string) || 'root'
    };
    const host: string = (process.env.MYSQL_HOST as string) || 'localhost';
    const insecureAuth: boolean = true;
    const port: number = Number.parseInt((process.env.MYSQL_PORT as string) || '3306', 10);
    const socketPath: string = (process.env.MYSQL_SOCKETPATH as string) || '';
    const ssl: any = {
      // DO NOT DO THIS
      // set up your ca correctly to trust the connection
      rejectUnauthorized: false
    };
    if (socketPath) {
      options.socketPath = socketPath;
    } else {
      options.host = host;
      options.insecureAuth = insecureAuth;
      options.port = port;
      options.ssl = ssl;
    }
    logger.trace({ moduleName, methodName, options });
    const connection = mysql.createConnection(options);

    connection.connect((err: any) => {
      if (err) {
        logger.warn({ moduleName, methodName, err });
        reject(err);
      } else {
        logger.info({ moduleName, methodName }, `connected as id ${connection.threadId}`);
        resolve(connection);
      }
    });
  });
}

export function disconnect(logger: any, connection: any): Promise<any> {
  const methodName: string = 'disconnect';
  logger.info({ moduleName, methodName }, `Starting...`);
  return new Promise((resolve, reject) => {
    connection.end((err: any) => {
      if (err) {
        logger.warn({ moduleName, methodName, err });
        reject(err);
      } else {
        resolve({ info: true });
      }
    });
  });
}

export function select(logger: any, conn: any, sql: string): Promise<any> {
  const methodName: string = 'select';
  logger.info({ moduleName, methodName }, `Starting...`);
  return new Promise((resolve, reject) => {
    let results: any;

    conn.query(sql, (err: any, rows: any, fields: any) => {
      if (err) {
        logger.warn({ moduleName, methodName, err });
        return reject(err);
      } else {
        results = rows;
        logger.trace({ moduleName, methodName, results });
        return resolve(results);
      }
    });
  });
}
