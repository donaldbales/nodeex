/* 
  exCsv.ts
  by Don Bales
  on 2019-01-02
  A library to read and parse a csv file into an array of objects

  https://csv.js.org/
*/

import * as csv from 'csv';
import * as fs from 'fs';
import * as util from 'util';

const moduleName: string = 'exCsv';

// I create this function to make it easy to develop and debug
function inspect(obj: any, depth: number = 5) {
  return util.inspect(obj, true, depth, false);
}

export function parseCSV(logger: any, csvArray: any): Promise<any> {
  const methodName: string = 'parseCSV';
  
  return new Promise((resolve, reject) => {
    
    logger.info(`${moduleName}#${methodName}: started.`);

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
        const error: any = err;  
        console.error(`${moduleName}#${methodName}: ${inspect(error)}`);
        return reject({ error });
      } else {
        const info: any = parser.info;
        return resolve({ data, info });
      }
    });
  });
}

export function readCSV(logger: any): Promise<any> {
  const methodName: string = 'readCSV';
  
  return new Promise((resolve, reject) => {
    
    logger.info(`${moduleName}#${methodName}: started.`);
    
    const fileName: string = (process.env.EX_CVS_FILENAME as string) || 'ex-csv.csv';
    
    // See: https://nodejs.org/dist/latest-v6.x/docs/api/fs.html#fs_file_system
    fs.readFile(fileName, 'utf8', (err: any, data: any) => {
      if (err) {
        const error: any = err;  
        console.error(`${moduleName}#${methodName}: ${inspect(error)}`);
        return reject({ error });
      } else {
        return resolve({ data });
      }
    });
  });
}
