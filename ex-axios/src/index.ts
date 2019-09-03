import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getLogger } from 'ex-logger';
import * as util from 'util';

import { inspect } from './lib/inspect';

const logger: any = getLogger('ex-axios');
const moduleName: string = 'index';

// An asynhronous function to get weather forecast data from
// https://www.weather.gov/documentation/services-web-api
async function forecast(url: string): Promise<any> {
  const methodName: string = 'forecast';

  logger.info(`${moduleName}#${methodName}`);

  let results: any = {};
  let response: any = {};
  const options: any = {
    headers: {
      'Content-Type': ``,
      'User-Agent': `ex-axios_don.bales@bounteous.com`
    }
  };
  try {
    response = await axios.get(url, options);
    logger.info(`${moduleName}#${methodName}: response=\n${inspect(response)}`);

    results = response.data ? response.data : {};
    logger.info(`${moduleName}#${methodName}: results=\n${inspect(results)}`);
    return results;
  } catch (error) {
    logger.error(`${moduleName}#${methodName}: error=\n${inspect(error)}`);
    return results;
  }
}

// A main method with no command line parameter management
async function main(): Promise<any> {
  const methodName: string = 'main';

  logger.info(`${moduleName}#${methodName}: Starting...`);

  const unUsedLocal: any = await forecast('https://api.weather.gov/zones/forecast/ILZ013/forecast');

  logger.info(`${moduleName}#${methodName}: Ending.`);
}

// Start the program
if (require.main === module) {
  main();
}
