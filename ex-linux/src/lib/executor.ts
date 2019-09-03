import * as childProcess from 'child_process';

import { inspect } from './inspect';

const moduleName: string = 'executor';

export async function exec(logger: any, command: string, options: any = {}): Promise<any> {
  const methodName: string = 'exec';
  logger.info({ moduleName, methodName, command }, `Starting...`);
  return new Promise((resolve, reject) => {
    const result: any = { code: -1, error: null, stderr: null, stdout: null };
    const handle = childProcess.exec(command, options);
    logger.debug({ moduleName, methodName, eventNames: inspect(handle.eventNames()) });

    handle.stdout.on('data', (data) => {
      logger.debug({ moduleName, methodName }, `stdout.on data: ${inspect(data)}`);
      if (!result.stdout) {
        result.stdout = [];
      }
      result.stdout.push(data);
    });

    handle.stderr.on('data', (data) => {
      logger.debug({ moduleName, methodName }, `stderr.on data: ${inspect(data)}`);
      if (!result.stderr) {
        result.stderr = [];
      }
      result.stderr.push(data);
    });

    handle.on('close', (code) => {
      logger.debug({ moduleName, methodName }, `on close: child process exited with code ${inspect(code)}`);
      result.code = code;
      resolve(result);
    });

    handle.on('error', (error) => {
      logger.error({ moduleName, methodName }, `on error: ${inspect(error)}`);
      result.error = error;
      reject(result);
    });
  });
}
