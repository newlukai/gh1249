'use strict';

const oracledb = require('oracledb');

oracledb.autoCommit = true;
oracledb.outFormat = oracledb.OBJECT;
oracledb.fetchAsBuffer = [oracledb.BLOB];

async function run() {
  let connection;

  try {
    connection = await oracledb.getConnection(  {
      user          : 'GH1249',
      password      : 'GH1249',
      connectString : "localhost/XE"
    });
    console.log('Got connection.');

    await connection.execute(
      `CREATE TABLE "GH1249"."TABLEX" (
        "COLUMNA" NUMBER(20,0), 
        "COLUMNB" VARCHAR2(128 BYTE), 
        "COLUMNC" VARCHAR2(128 BYTE), 
        "COLUMND" VARCHAR2(128 BYTE), 
        "COLUMNE" NUMBER(10,0), 
        "COLUMNF" NUMBER(5,0), 
        "COLUMNG" VARCHAR2(128 BYTE), 
        "COLUMNH" NUMBER(10,0), 
        "COLUMNI" NUMBER(10,0), 
        "COLUMNJ" VARCHAR2(32 BYTE)
       )`);
     console.log('Created TableX.');
    
    await connection.execute(
      `CREATE SEQUENCE Seq_X
  START WITH 1
  INCREMENT BY 1`);
  console.log('Created sequence for TableX.');
  
    await connection.execute(
      `CREATE TRIGGER  BI_X
BEFORE INSERT ON TABLEX
FOR EACH ROW
BEGIN
  select Seq_X.nextval into :NEW.COLUMNA from dual;
END;`);
console.log('Created trigger for TableX.');
    
    await connection.execute(
      `CREATE TABLE Infos
(
	Version varchar (32),
	State blob
)`);
console.log('Created table Infos.');

    await connection.execute(
      `INSERT INTO Infos(Version) VALUES('2.0.0')`);
      console.log('Inserted Infos.');
      
    const result = await connection.execute(`SELECT Version AS VERSION FROM Infos`);
    console.log('Got version.', result.rows);

    await connection.execute(
      `INSERT INTO TableX (ColumnD,ColumnB,ColumnC,ColumnG,ColumnJ,ColumnF,ColumnH,ColumnI) VALUES (:0,:1,:2,:3,:4,:5,:6,:7)`,
      ['stringWith40Characters------------------',
        'stringWith18Charac',
        '9characte',
        'stringWith26Characters----',
        '6chars',
        false,
        0,
        1162337]
    );
    console.log('Inserted TableX entry.');
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

run();
