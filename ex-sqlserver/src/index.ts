import { getLogger } from 'ex-logger';
import { Connection } from 'tedious';

import * as exTedious from './lib/exTedious';
import { inspect } from './lib/inspect';
import * as sqlServer from './lib/sqlServer';

const logger: any = getLogger('ex-sqlserver');
const moduleName: string = 'index';

// A main method with no command line parameter management
async function main(): Promise<any> {
  const methodName: string = 'main';
  logger.info({ moduleName, methodName }, `Starting...`);
  let conn: any = null;
  try {
    conn = await sqlServer.connect(logger);
  } catch (err) {
    logger.error({ moduleName, methodName, err });
    setTimeout(() => { process.exit(1); }, 10000);
  }

  if (conn) {
    try {
      const create: any = await exTedious.createExTedious(logger, conn);
      logger.info({ moduleName, methodName }, `create=\n${inspect(create)}`);

      const insert: any = await exTedious.insertExTedious(logger, conn);
      logger.info({ moduleName, methodName }, `insert=\n${inspect(insert)}`);

      let select: any = await exTedious.selectAllExTedious(logger, conn);
      logger.info({ moduleName, methodName }, `select=\n${inspect(select)}`);

      const update: any = await exTedious.updateExTedious(logger, conn);
      logger.info({ moduleName, methodName }, `update=\n${inspect(update)}`);

      select = await exTedious.selectOneExTedious(logger, conn);
      logger.info({ moduleName, methodName }, `select=\n${inspect(select)}`);

      // Just in case you're wondering, yes delete is a Javascript keyword
      const dulete: any = await exTedious.deleteExTedious(logger, conn);
      logger.info({ moduleName, methodName }, `dulete=\n${inspect(dulete)}`);

      select = await exTedious.selectAllExTedious(logger, conn);
      logger.info({ moduleName, methodName }, `select=\n${inspect(select)}`);
    } catch (err) {
      logger.error({ moduleName, methodName, err });
      setTimeout(() => { process.exit(2); }, 10000);
    }
    conn.close();
  }
  process.exit(0);
}

// Start the program
if (require.main === module) {
  main();
}
