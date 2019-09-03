import { getLogger } from 'ex-logger';

import { connect, select } from './lib/sql';

const logger: any = getLogger('ex-mysql');
const moduleName: string = 'index';

export async function main(): Promise<any> {
  const methodName: string = 'main';
  logger.level('trace');
  logger.info({ moduleName, methodName }, `Starting...`);
  let conn: any = null;
  try {
    logger.info({ moduleName, methodName }, `Connecting...`);
    conn = await connect(logger);
    logger.info({ moduleName, methodName, conn });
  } catch (err) {
    logger.error({ moduleName, methodName, err });
    setTimeout(() => { process.exit(1); }, 10000);
  }
  let result: any = null;
  let results: any = null;
  if (conn) {
    try {
      logger.info({ moduleName, methodName }, `Querying...`);
      results = await select(logger, conn, `
        select database();
      `);
      logger.info({ moduleName, methodName, results });
      for (result of results) {
        logger.info({ moduleName, methodName, result });
      }
    } catch (err) {
      logger.error({ moduleName, methodName, err });
      setTimeout(() => { process.exit(2); }, 10000);
    }
    conn.destroy();
  }
}

// Start the program
if (require.main === module) {
  main();
}
