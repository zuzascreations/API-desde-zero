const express = require('express')//copio informacion del server (busca en la web - npm expresss)
require('dotenv').config()//esto lee .env. Debería ponerse más arriva possible
const entryRepository = require('./repository/mysql/mysqlEntryRepository')
const userRepository = require('./repository/mysql/mysqlUserRepository')
const entrySchema = require('./schemas/entrySchema')
const userSchema = require('./schemas/userSchema')
const emailSender = require('./notifier/emailSender')
const fileUpload = require('express-fileupload')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// const { userRoutes } = require('./routes')

const app = express()



//CONSTANTES
const { PORT, BASE_URL } = process.env //(destructuring de lo que hay en .env - asi saco la cont PORT para utilizarla en index)
console.log(PORT, BASE_URL)//para ver si lee la variable

//con esto conpruebo si me funciona server en Postman cual deberia imprimirme el console.log
app.get('/', function (req, res) {
  res.send('Hello World')
})

app.use(express.json()) //(para que el body no es vacio)
app.use('/public', express.static('uploads'))//esto dice cual es la carpeta que va a ser publica -> la ruta (localhost:3000/public/avatar.png)
app.use(fileUpload())

//crear los endpoints

//1 - POST - crear user y comprobar email, password, username
// añadir fn que me mete New date para createAt

app.post('/users', async (req, res) => {
    const user = req.body
    console.log(user)
    //esto con schema ya sobra
    // if (!user) {
    //     res.status(400)
    //     res.end('You should provide valid user data.')
    //     return
    // }

    try {
        await userSchema.validateAsync(user)
    } catch (error) {
        res.status(404)
        res.end(error.message)
        return
    }

    let savedUser
    try {
        savedUser = await userRepository.saveUser(user)
    } catch (error) {
        console.log(error.message)
        res.status(500)
        res.end('Database error.')
        return
    }

    res.status(200)
    res.send(savedUser)
})


//2 - POST - crear entrada
app.post('/entries', async (req, res) => {
    const entry = req.body

    try {
        await entrySchema.validateAsync(entry)
    } catch (error) {
        res.status(404)
        res.end(error.message)
        return
    }

    let savedEntry
    try {
        savedEntry = await entryRepository.saveEntry(entry)
    } catch (error) {
        console.log(error.message)
        res.status(500)
        res.end('Database error.')
        return
    }

    res.status(200)
    res.send(savedEntry)
})

//     if (!entry) {
//         res.status(400)
//         res.end('You should provide a valid entry to save.')
//         return
//     }

//     let savedEntry
//     try {
//         savedEntry = await entryRepository.saveEntry(entry)
//     } catch (error) {
//         console.log(error.message)
//         res.status(500)
//         res.end('Database error.')
//         return
//     }

//     res.status(200)
//     res.send(savedEntry)
// })

// // - GET/entries - get all entries
// app.get('/entries', async (req, res) => {

//     let entries
//     try {
//         entries = await entryRepository.getEntry()
//     } catch (error) {
//         res.status(500)
//         res.end('Database error')
//     }

//     res.status(200)
//     res.send(entries)
// })

// - GET/entries - get entries from to
/**
 * search String search by place
 * order String - place | id | date
 * direction String - ASC | DESC
 */
app.get('/entries', async (req, res) => {
    const { search, order, direction } = req.query

    let entries
    try {
        entries = await entryRepository.getEntry({ search, order, direction })
        if (!entries){
            throw new Error()
        }
    } catch (error) {
        res.status(500)
        res.end(error.message)
        return
    }

    res.status(200)
    res.send(entries)
})

// email sender
app.post('/email/test', async (req, res) => {
    const { email } = req.body //igual a req.body.email

    const result = await emailSender.testEmail(email)

    console.log(result)

    res.send('ok')
})

//SUBIR PHOTOS a uploads
app.post('/uploads', (req, res) => {
    const avatar = req.files.avatar

    avatar.mv('./uploads/avatar.png')//esto me deberia guardar el archivo en carpeta uploads despues de ejecutar postman. Y esto despues tengo que guardar en DB

    res.send('OK')
})




//lo que me aparece en el terminal(siempre se pone como último)
app.listen(PORT, () => {
    console.log(`Server is running on ${BASE_URL}:${PORT}`)
})