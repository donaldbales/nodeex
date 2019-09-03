import { getLogger } from 'ex-logger';
import * as util from 'util';

import * as exCsv from './lib/exCsv';
import { inspect } from './lib/inspect';

const logger: any = getLogger('ex-csv');
const moduleName: string = 'index';

// A main method with no command line parameter management
async function main(): Promise<any> {
  const methodName: string = 'main';
  logger.info({ moduleName, methodName }, `Starting...`);

  const csvData: any = await exCsv.readCSV(logger);
  logger.info({moduleName, methodName, csvData });

  const parsedData: any = await exCsv.parseCSV(logger, csvData.data);
  logger.info({moduleName, methodName, parsedData });

  process.exit(0);
}

// Start the program
if (require.main === module) {
  main();
}
