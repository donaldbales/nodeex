// See: https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md

import * as moment from 'moment';
import * as path from 'path';
import * as ssh2 from 'ssh2';

import { inspect } from './inspect';

const moduleName: string = 'sftp';

export function connect(logger: any): Promise<any> {
  const methodName: string = 'connect';
  logger.info({ moduleName, methodName }, `Starting...`);

  return new Promise((resolve, reject) => {
    const conn: any = new ssh2.Client();
    const host: string = (process.env.SFTP_HOST as string) || '';
    const password: string = (process.env.SFTP_PASSWORD as string) || '';
    const port: number = Number((process.env.SFTP_PORT as string) || '22');
    const username: string = (process.env.SFTP_USERNAME as string) || '';

    conn.on('close', (hadError: boolean) => {
      logger.debug({ moduleName, methodName }, `on close ${hadError ? 'with errors' : ''}.`);
    });

    conn.on('end', () => {
      logger.debug({ moduleName, methodName }, `on end.`);
    });

    conn.on('error', (err: any) => {
      const error: any = err;
      logger.debug({ moduleName, methodName, err }, `on error.`);
      return reject(err);
    });

    conn.on('ready', () => {
      logger.debug({ moduleName, methodName }, `on ready.`);
      return resolve(conn);
    });

    conn.connect({
      algorithms: {
        serverHostKey: ['ssh-dss'],
      },
      // debug: logger.debug,
      host,
      port,
      username,
      password
    });
  });
}

export function fastget(logger: any, sftp: any, remotePath: string, localPath: string) {
  const methodName: string = 'fastget';
  logger.info({ moduleName, methodName }, `Starting...`);

  return new Promise((resolve, reject) => {
    sftp.fastGet(remotePath, localPath, (err: any) => {
      if (err) {
        logger.error({ moduleName, methodName, err });
        return reject(err);
      }
      logger.debug({ moduleName, methodName }, `Success.`);
      return resolve({ success: true });
    });
  });
}

export function readdir(logger: any, sftp: any, dir: string = '/'): Promise<any> {
  const methodName: string = 'readdir';
  logger.info({ moduleName, methodName }, `Starting...`);

  return new Promise((resolve, reject) => {
    sftp.readdir(dir, (err: any, list: any) => {
      if (err) {
        logger.error({ moduleName, methodName, err });
        return reject(err);
      }
      logger.debug({ moduleName, methodName }, `list: ${inspect(list)}`);
      return resolve(list);
    });
  });
}

export function rename(logger: any, sftp: any, fromPath: string, toPath: string) {
  const methodName: string = 'rename';
  logger.info({ moduleName, methodName }, `Starting...`);

  return new Promise((resolve, reject) => {
    sftp.on('continue', () => {
      logger.debug({ moduleName, methodName }, `on continue.`);
      return resolve({ success: true });
    });

    const result: boolean = sftp.rename(fromPath, toPath, (err: any) => {
      if (err) {
        logger.error({ moduleName, methodName, err });
        return reject(err);
      } else
      if (result) {
        logger.debug({ moduleName, methodName }, `success.`);
        return resolve({ success: true });
      }
    });
  });
}

export function session(logger: any, conn: any): Promise<any> {
  const methodName: string = 'session';
  logger.info({ moduleName, methodName }, `Starting...`);

  return new Promise((resolve, reject) => {
    conn.sftp((err: any, sftp: any) => {
      if (err) {
        logger.error({ moduleName, methodName, err });
        return reject(err);
      }
      return resolve(sftp);
    });
  });
}

export async function download(logger: any, filename: string): Promise<any> {
  const methodName: string = 'download';
  logger.info({ moduleName, methodName }, `Starting...`);

  let conn: any;
  let sftp: any;
  let list: any;
  let result: any = {};

  const sftpdir: string = (process.env.SFTP_DIR as string) || '/';
  logger.debug({ moduleName, methodName }, `sftpdir: ${sftpdir}`);

  const tmpdir: string = (process.env.TMPDIR as string) || './df/';
  logger.debug({ moduleName, methodName }, `tmpdir: ${tmpdir}`);

  try {
    conn = await connect(logger);
  } catch (err) {
    logger.error({ moduleName, methodName, err }, `Can't connect to SFTP server`);
    conn.end();
    return { err };
  }

  try {
    sftp = await session(logger, conn);
  } catch (err) {
    logger.error({ moduleName, methodName, err }, `Can't establish a session with the SFTP server`);
    conn.end();
    return { err };
  }

  try {
    list = await readdir(logger, sftp, sftpdir);
  } catch (err) {
    logger.error({ moduleName, methodName, err }, `Can't read the ${sftpdir} directory on the SFTP server`);
    conn.end();
    return { err };
  }

  try {
    let found: boolean = false;
    for (const listItem of list) {
      if (listItem.filename === filename) {
        found = true;
        break;
      }
    }
    if (found) {
      result = await fastget(logger, sftp, path.join(sftpdir, filename), path.join(tmpdir, filename));
      logger.info({ moduleName, methodName }, `result: ${inspect(result)}`);
    }
    if (result.success) {
      result = await rename(logger, sftp, path.join(sftpdir, filename), `${path.join(sftpdir, filename)}.transferred_on.${moment().format('YYYYMMDDHHmmss')}`);
      logger.info({ moduleName, methodName }, `result: ${inspect(result)}`);
    }
  } catch (err) {
    logger.error({ moduleName, methodName, err }, `Can't download file ${path.join(sftpdir, filename)} from the SFTP server`);
    return { err };
  }

  logger.debug({ moduleName, methodName }, `closing connection.`);
  conn.end();
  return result;
}

function streamWriter(logger: any, sftp: any, filename: string, options: any): Promise<any> {
  const methodName: string = 'streamWriter';
  logger.info({ moduleName, methodName }, `Starting...`);

  return new Promise((resolve, reject) => {
    const result: any = sftp.createWriteStream(filename, options);
    result.on('close', () => {
      logger.debug({ moduleName, methodName }, `on close bytes written: ${result.bytesWritten}`);
    });
    result.on('pipe', () => {
      logger.debug({ moduleName, methodName }, `on pipe`);
    });
    result.on('open', () => {
      logger.debug({ moduleName, methodName }, `on open ${result.path}`);
      resolve(result);
    });
  });
}

function piper(logger: any, reader: any, writer: any): Promise<any> {
  const methodName: string = 'piper';
  logger.info({ moduleName, methodName }, `Starting...`);

  return new Promise((resolve, reject) => {
    writer.on('error', (err: any) => {
      logger.error({ moduleName, methodName, err}, `on error`);
      return reject(false);
    });

    writer.on('finish', () => {
      logger.debug({ moduleName, methodName }, `on finish`);
      return resolve(true);
    });

    reader.pipe(writer);
  });
}

export async function upload(logger: any, filename: string, reader: any): Promise<any> {
  const methodName: string = 'upload';
  logger.info({ moduleName, methodName }, `Starting...`);

  let conn: any;
  let sftp: any;
  let writer: any;

  const sftpdir: string = (process.env.SFTP_DIR as string) || './';
  logger.debug({ moduleName, methodName }, `sftpdir: ${sftpdir}`);

  const tmpdir: string = (process.env.TMPDIR as string) || './df/';
  logger.debug({ moduleName, methodName }, `tmpdir: ${tmpdir}`);

  try {
    conn = await connect(logger);
  } catch (err) {
    logger.error({ moduleName, methodName, err }, `Can't connect to SFTP server`);
    conn.end();
    return { err };
  }

  try {
    sftp = await session(logger, conn);
  } catch (err) {
    logger.error({ moduleName, methodName, err }, `Can't establish a session with the SFTP server`);
    conn.end();
    return { err };
  }
  // .${moment().format('YYYYMMDDHHmmss')}
  try {
    writer = await streamWriter(
      logger,
      sftp,
      path.join(sftpdir, filename),
      { encoding: 'utf8' }
    );
  } catch (err) {
    logger.error({ moduleName, methodName, err }, `Can't read the ${sftpdir} directory on the SFTP server`);
    conn.end();
    return { err };    
  }

  try {
    await piper(logger, reader, writer);

    conn.end();
  } catch (err) {
    logger.error({ moduleName, methodName, err }, `Can't download file ${path.join(sftpdir, filename)} from the SFTP server`);
    conn.end();
    return { err };
  }

  logger.info({ moduleName, methodName }, `closing connection.`);
}
