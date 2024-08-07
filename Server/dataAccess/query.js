// import { tanh } from "core-js/core/number";

function getByParamsQuery(tableName, queries) {
    const params = createGenericParamsForGet(tableName, queries)
    const query = `SELECT * FROM ${tableName}  ${params} `;
    return query
}
function getItemQuery(tableName) {
    const query = `SELECT * FROM ${tableName} `;
    return query
}

function updateItemQuery(tableName, newItem) {
    const params = createGenericQueryForUpdate(newItem.params)
    const whereParams = createGenericQueryForUpdate(newItem.whereParams)
    const query = `UPDATE ${tableName} SET ${params} WHERE ${whereParams}`
    return query
}

function createGenericQueryForUpdate(newItem) {
    let keyString = ''
    Object.keys(newItem).map(key => keyString += `${key} = ?,`)
    keyString = keyString.slice(0, - 1)
    return keyString
}

function createGenericParamsForGet(tableName, queries) {
    let paramsString = ''
    const arrParams = Object.keys(queries);
    const fields = arrParams.map((f) => {
        if (f != "_limit" && f != "_sort" && f != "_page")
            return f
    })
    if (fields[0] != undefined) {
        paramsString += "where "
        fields.map(key => paramsString +=key == 'date' ? `DATE(${key}) = ? and `: `${key} = ? and `)
        paramsString = paramsString.slice(0, - 4)
        tableName=="travels"? paramsString += 'and date> NOW()':null
        tableName=="communication"? paramsString += 'and (status=1 or status=2)' : null
    }
    else{
        tableName=="travels"? paramsString += 'where date> NOW()':null
    }
    return paramsString
}

function addItemQuery(tableName, newItem) {
    const params = createGenericQueryForAdd(newItem)
    const query = `INSERT INTO ${process.env.DB_NAME}.${tableName} ${params}`
    return query
}

function createGenericQueryForAdd(newItem) {
    let keyString = '('
    let questionMarks = '('
    Object.keys(newItem).map(key => {
        keyString += `${key}, `;
        questionMarks += (key == "startPoint" || key == "destinationPoint") ? 'POINT(?, ?), ': "?, ";
    })
    keyString = keyString.slice(0, keyString.length - 2)
    questionMarks = questionMarks.slice(0, questionMarks.length - 2)
    keyString += `) VALUES`
    keyString += questionMarks
    keyString += ')'
    return keyString
}




function getTravelsQuery(tableName) {
    const query = `SELECT id, ST_X(startPoint) AS latStart, ST_Y(startPoint) AS lngStart, ST_X(destinationPoint) AS latDestination, ST_Y(destinationPoint) AS lngDestination
    FROM ${tableName}
    WHERE userType = 'driver' AND isAvailable = 1 AND ${tableName}.date > NOW() `
    return query;
}



export {

    getByParamsQuery, addItemQuery, getTravelsQuery,getItemQuery,updateItemQuery
}
