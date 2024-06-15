import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from '../services/bug.service.server.js'
import { loggerService } from '../services/logger.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())

// Express Routing:

app.get('/api/bug', (req, res) => {
    bugService.query()
	    .then(bugs => res.send(bugs))
        .then(bugs => console.log('bugs:', bugs))
        .catch(err => {
            loggerService.error(`Couldn't get bugs...`)
            res.status(500).send(`Couldn't get bugs...`)
        })
})

app.get('/api/bug/save', (req, res) => {
    const { _id, title, severity, description, createdAt } = req.query
    const bugToSave = { _id, title, severity: +severity, description, createdAt: +createdAt }

    bugService.save(bugToSave)
	    .then(savedBug => res.send(savedBug))
})

app.get('/api/bug/:id', (req, res) => {
    const { id } = req.params

    bugService.getById(id)
        .then(bug => res.send(bug))
})

app.get('/api/bug/:id/remove', (req, res) => {
    const { id } = req.params

    bugService.remove(id)
        .then(() => res.send(`bug ${id} deleted...`))
})

// app.get('/puki', (req, res) => {
//     var visitCount = req.cookies.visitCount || 0
//     // res.cookie('visitCount', ++visitCount)
//     res.cookie('visitCount', ++visitCount, { maxAge: 3000 })
// 	res.send(`<h1>Hello Puki ${visitCount}</h1>`)
// })


const port = 3030

app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))
