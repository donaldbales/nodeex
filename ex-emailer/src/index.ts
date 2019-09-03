/* tslint:disable:no-console */

import * as emailer from './lib/emailer';

const moduleName: string = 'index';

export default async function main(...args: any[]): Promise<any> {
  const methodName: string = 'main';
  console.info(`${moduleName}#${methodName}: Starting...`);
  console.log(await emailer.send('testing, 1, 2, 3...', 'testing emailer'));
}

// Start the program
if (require.main === module) {
  main();
}
