const connection = require('./mysqlConnection')



//POST /users - crear user pendiente de activar
const saveUser = async (user) => {
    const results = await connection.query("INSERT INTO users (email, password, username, createdAt) VALUES (?, ?, ?, ?)", [user.email, user.password, user.username, user.createdAt])

    // el idUser lo cojo desde payload de jwt en index(eso se genera cuando logea el usuario)

    newUser = {...user, id: results[0].insertId}
    return newUser
}

//GET /users/:idUser - get users - todos

//GET /users/validate/:registrationCode - get user by id

//POST /users/login - validar un usuario recien registrado

//PUT /users/:idUser - Edit nombre, email y avatar de un usuario

//PUT /users/:idUser/password- password - Editar la contraseña de un usuario

//PUT /users/reset-password - recover-password -Enviar un correo con el codigo de reseteo de la contraseña

//DELETE /users/:idUser - Eliminar usuario

module.exports = {
    saveUser,
}