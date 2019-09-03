// https://csv.js.org

import * as csv from 'csv';
import * as fs from 'fs';
import * as util from 'util';

import { inspect } from './inspect';

const moduleName: string = 'exCsv';

export function parseCSV(logger: any, csvArray: any): Promise<any> {
  const methodName: string = 'parseCSV';
  logger.info({ moduleName, methodName }, `Starting...`);

  return new Promise((resolve, reject) => {
    // See: https://csv.js.org/parse/options/
    const options: any = {
      cast: true,
      cast_date: true,
      columns: true,
      delimiter: ',',
      rtrim: true
    };

    const parser: any = csv.parse(csvArray, options, (err: any, data: any) => {
      if (err) {
        logger.error({ moduleName, methodName, err });
        return reject({ err });
      } else {
        const info: any = parser.info;
        return resolve({ data, info });
      }
    });
  });
}

export function readCSV(logger: any): Promise<any> {
  const methodName: string = 'readCSV';
  logger.info({ moduleName, methodName }, `Starting...`);

  return new Promise((resolve, reject) => {
    const fileName: string = (process.env.EX_CVS_FILENAME as string) || 'ex-csv.csv';

    // See: https://nodejs.org/dist/latest-v6.x/docs/api/fs.html#fs_file_system
    fs.readFile(fileName, 'utf8', (err: any, data: any) => {
      if (err) {
        logger.error({ moduleName, methodName, err });
        return reject({ err });
      } else {
        return resolve({ data });
      }
    });
  });
}
