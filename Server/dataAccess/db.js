import mysql from 'mysql2/promise';
import 'dotenv/config'


async function executeQuery(query, params){
    console.log('params')
    console.log(params)
    console.log('query')
    console.log(query)
    let results;
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        port: 3316,
        database: process.env.DB_NAME,
        password: process.env.PASSWORD
    });
 
    try {
        [results] = await connection.execute(query,params);
        console.log("results");
        console.log(results);
    } catch (err) {
        console.log("err");
        console.log(err);
    }
    finally {
        connection.end();
    }
    return results;
}

export{
    executeQuery
}