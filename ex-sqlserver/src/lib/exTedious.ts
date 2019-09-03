/* 
  exTedious.ts
  by Don Bales
  on 2018-12-20
  A library to create, insert, select, update and delete from table EX_TEDIOUS

  https://docs.microsoft.com/en-us/sql/t-sql/language-reference?view=sql-server-2017
  http://tediousjs.github.io/tedious/
*/

import { Connection } from 'tedious';
import * as util from 'util';

import * as sqlServer from './sqlServer';

const moduleName: string = 'exTedious';

// I create this function to make it easy to develop and debug
function inspect(obj: any, depth: number = 5) {
  return util.inspect(obj, true, depth, false);
}

export async function createExTedious(logger: any, conn: Connection): Promise<any> {
  const methodName: string = 'createExTedious';
  
  logger.info(`${moduleName}#${methodName}: started.`);
  
  const sql: string = `
    drop   table if exists EX_TEDIOUS;
    create table           EX_TEDIOUS (
    A_BIGINT                       BIGINT  IDENTITY(1, 1)     NOT NULL,
    A_BIT                          BIT             DEFAULT 1,
    A_DATE                         DATE            DEFAULT CURRENT_TIMESTAMP,
    A_DATETIME2                    DATETIME2       DEFAULT CURRENT_TIMESTAMP,
    A_DATETIMEOFFSET               DATETIMEOFFSET  DEFAULT CURRENT_TIMESTAMP,
    A_DECIMAL                      DECIMAL(32,16)  DEFAULT 0.14285714285714285,
    A_FLOAT                        FLOAT           DEFAULT 0.14285714285714285,
    A_INT                          INT             DEFAULT 2147483647,
    A_NUMERIC                      NUMERIC(32,16)  DEFAULT 0.14285714285714285,
    A_NVARCHAR                     NVARCHAR(500),
    A_REAL                         REAL            DEFAULT 0.142857142857142857143,
    A_SMALLINT                     SMALLINT        DEFAULT 32767,
    A_TINYINT                      TINYINT         DEFAULT 255,
    A_VARCHAR                      VARCHAR(50) );

    alter table EX_TEDIOUS ADD
    constraint  EX_TEDIOUS_PK
    primary key (
    A_BIGINT );
  `;
  
  let results: any = {};
  try {
    results = await sqlServer.executeDDL(logger, conn, sql);
    logger.info(`${moduleName}#${methodName}: \n${inspect(results)}`);
  } catch (caught) {
    let error: any = caught;
    logger.error(`${moduleName}#${methodName}: \n${inspect(error)}`);
  }
  
  return results;
}

export async function deleteExTedious(logger: any, conn: Connection): Promise<any> {
  const methodName: string = 'deleteExTedious';
  
  logger.info(`${moduleName}#${methodName}: started.`);
  
  const sql: string = `
    delete from EX_TEDIOUS
    where  a_varchar = @a_varchar;
  `;
  
  let results: any = {};
  const params: any[] = [];
  //          [ column name,  column value ]
  params.push(['a_varchar',  'a_varchar one']);
  try {
    results = await sqlServer.executeDML(logger, conn, sql, params);
    logger.info(`${moduleName}#${methodName}: \n${inspect(results)}`);
  } catch (caught) {
    let error: any = caught;
    logger.error(`${moduleName}#${methodName}: \n${inspect(error)}`);
  }

  return results;  
}

export async function insertExTedious(logger: any, conn: Connection): Promise<any> {
  const methodName: string = 'insertExTedious';
  
  logger.info(`${moduleName}#${methodName}: started.`);
  
  const sql: string = `
    insert into EX_TEDIOUS (
           A_VARCHAR,
           A_NVARCHAR)
    values (
           @a_varchar,
           @a_nvarchar);
  `;
  
  let results: any = {};
  try {
    results = await sqlServer.executeDML(logger, conn, sql, 
                [ ['a_varchar', 'a_varchar one'], ['a_nvarchar', 'a_nvarchar one'] ]);
    logger.info(`${moduleName}#${methodName}: \n${inspect(results)}`);
  } catch (caught) {
    let error: any = caught;
    logger.error(`${moduleName}#${methodName}: \n${inspect(error)}`);
  }
  
  const params: any[] = [];
  //          [ column name,  column value ]
  params.push(['a_varchar',  'a_varchar two']);
  params.push(['a_nvarchar', 'a_nvarchar two']);
  try {
    results = await sqlServer.executeDML(logger, conn, sql, params);
    logger.info(`${moduleName}#${methodName}: \n${inspect(results)}`);
  } catch (caught) {
    let error: any = caught;
    logger.error(`${moduleName}#${methodName}: \n${inspect(error)}`);
  }

  return results;  
}

export async function selectAllExTedious(logger: any, conn: Connection): Promise<any> {
  const methodName: string = 'selectAllExTedious';
  
  logger.info(`${moduleName}#${methodName}: started.`);
  
  const sql: string = `
    select *
    from   EX_TEDIOUS;
  `;
  
  let results: any[] = [];
  try {
    results = await sqlServer.executeDML(logger, conn, sql, []);
    logger.info(`${moduleName}#${methodName}: \n${inspect(results)}`);
  } catch (caught) {
    let error: any = caught;
    logger.error(`${moduleName}#${methodName}: \n${inspect(error)}`);
  }

  return results;  
}

export async function selectOneExTedious(logger: any, conn: Connection): Promise<any> {
  const methodName: string = 'selectOneExTedious';
  
  logger.info(`${moduleName}#${methodName}: started.`);
  
  const sql: string = `
    select *
    from   EX_TEDIOUS
    where  a_varchar = @a_varchar;
  `;
  
  let results: any[] = [];
  const params: any[] = [];
  //          [ column name,  column value ]
  params.push(['a_varchar',  'a_varchar two']);
  try {
    results = await sqlServer.executeDML(logger, conn, sql, params);
    logger.info(`${moduleName}#${methodName}: \n${inspect(results)}`);
  } catch (caught) {
    let error: any = caught;
    logger.error(`${moduleName}#${methodName}: \n${inspect(error)}`);
  }

  return results;  
}

export async function updateExTedious(logger: any, conn: Connection): Promise<any> {
  const methodName: string = 'updateExTedious';
  
  logger.info(`${moduleName}#${methodName}: started.`);
  
  const sql: string = `
    update x
    set    a_bit = 0,
           a_decimal = 0,
           a_float = 0,
           a_int = 0,
           a_numeric = NULL,
           a_real = NULL,
           a_smallint = NULL,
           a_tinyint = NULL
    from   EX_TEDIOUS x
    where  a_varchar = @a_varchar;
  `;
  
  let results: any = {};
  const params: any[] = [];
  //          [ column name,  column value ]
  params.push(['a_varchar',  'a_varchar two']);
  try {
    results = await sqlServer.executeDML(logger, conn, sql, params);
    logger.info(`${moduleName}#${methodName}: \n${inspect(results)}`);
  } catch (caught) {
    let error: any = caught;
    logger.error(`${moduleName}#${methodName}: \n${inspect(error)}`);
  }

  return results;  
}

