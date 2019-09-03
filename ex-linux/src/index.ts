import { getLogger } from 'ex-logger';

import * as executor from './lib/executor';

const logger: any = getLogger('ex-linux');
const moduleName: string = 'index';

export default async function main(...args: any[]): Promise<any> {
  const methodName: string = 'main';
  logger.level('trace');
  logger.info({ moduleName, methodName }, `Starting...`);
  const results: any = executor.exec(logger, 'pwd && ls -lap');
}

// Start the program
if (require.main === module) {
  main();
}
