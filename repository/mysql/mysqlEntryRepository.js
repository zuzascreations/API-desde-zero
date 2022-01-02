const connection = require('./mysqlConnection')


//POST /entries - crear entrada
const saveEntry = async (entry) => {
    const date = new Date
    const newDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`


    const results = await connection.query("INSERT INTO entries (place, description, idUser, createdAt, modifiedAt) VALUES (?, ?, ?, ?, ?)", [entry.place, entry.description, entry.idUser, newDate, entry.modifiedAt])

    // el idUser lo cojo desde payload de jwt en index(eso se genera cuando logea el usuario)

    newEntry = {...entry, id: results[0].insertId, createdAt: newDate}
    return newEntry
}

//GET /entries - obtener listado de entradas from to
const getEntry = async ({ search = '', order = 'place', direction = 'ASC' }) => {
    let orderBy
    switch (order) {
        default:
        case 'place':
            orderBy = 'place'
            break
        case 'id':
            orderBy = 'id'
            break
        case 'date':
            orderBy = 'createdAt'
            break
    }

    let directionTo
    switch (direction.toUpperCase()) {
        default:
        case 'ASC':
            directionTo = 'ASC'
            break
        case 'DESC':
            directionTo = 'DESC'
            break
    }

    const query = await connection.query('SELECT * FROM entries WHERE place LIKE ? ORDER BY ? ?', [`%${search}%`, orderBy, directionTo])

    return query[0]

}

//GET /entries/:idEntry - entrada by id

//PUT /entries/:idEntry - editar una entrada

//DELETE /entries/.idEntry - Borrar una entrada

//POST /entries/:idEntry/photos - agregar una foto a una entrada

//DELETE /entries/:idEntry/photos/:idPhotos - eliminar una foto de una entrada

//POST /entries/:idEntry/votes - votar una entrada


module.exports = {
    saveEntry,
    getEntry,
}