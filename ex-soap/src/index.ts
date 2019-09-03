import { getLogger } from 'ex-logger';
import * as soap from 'soap';

import { inspect } from './lib/inspect';

const logger: any = getLogger('ex-soap');
const moduleName: string = 'index';

export async function main() {
  const methodName: string = 'main';
  logger.info({ moduleName, methodName }, `Starting...`);
  
  const options: any = {
    ignoredNamespaces: {
      namespaces: ['namespaceToIgnore', 'tm']
    },
    useEmptyTag: true
  }
  const url: string = 'http://fake-soap-source.com?WSDL';
  const args: any = {
    activeTimestamp: '1900-01-01T00:00:00.000Z',
    inactiveTimestamp: '9999-12-31T23:59:59.999Z'
  };
  logger.info({ moduleName, methodName }, `args=${inspect(args)}`);
  let client: any;
  try {
    client = await soap.createClientAsync(url);
    client.setSecurity(new soap.BasicAuthSecurity('specify-basic-username', 'specify-basic-password'));
    // process.exit(1);
  } catch (err) {
    logger.error({ moduleName, methodName, err });
    process.exit(1);
  }
  logger.info({ moduleName, methodName }, `${inspect(client.describe())}\n`);
  // process.exit(1);
  // GetCustomer:
  const f: any = client.GetCustomerAsync;
  let result: any;
  try {
    result = await f(args);
    logger.info({ moduleName, methodName }, `GetCustomer Result: ${inspect(result)}`);
  } catch (err) {
    logger.error({ moduleName, methodName, err }, `GetCustomer Error`);
  }
  // GetCart:
  const args2: any = {
    activeTimestamp: '1900-01-01T00:00:00.000Z',
    inactiveTimestamp: '9999-12-31T23:59:59.999Z'
  };
  const f2: any = client.GetCartAsync;
  let result2: any;
  try {
    result2 = await f2(args2);
    logger.info({ moduleName, methodName }, `GetCart Result: ${inspect(result2)}`);
  } catch (err) {
    logger.info({ moduleName, methodName, err }, `GetCart Error`);
  }
}

// Start the program
if (require.main === module) {
  main();
}
