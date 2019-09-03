import { getLogger } from 'ex-logger';

import { download } from './lib/sftp';

const logger: any = getLogger('ex-sftp');
const moduleName: string = 'index';

export async function main(): Promise<any> {
  const methodName: string = 'main';
  logger.level('trace');
  logger.info({ moduleName, methodName }, `Starting...`);

  return await download(logger, 'specify-a-filename');
}

// Start the program
if (require.main === module) {
  main();
}
