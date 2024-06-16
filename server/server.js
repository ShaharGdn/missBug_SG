import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from '../services/bug.service.server.js'
import { loggerService } from '../services/logger.service.js'
import { utilService } from '../services/util.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specific HTTP methods
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
    next()
})


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
    var visitedBugs = req.cookies.visitedBugs ? JSON.parse(req.cookies.visitedBugs) : []

    if (visitedBugs.length >= 3) res.status(401).send('Wait for a bit')
    if (!visitedBugs.includes(id)) visitedBugs.push(id)
    res.cookie('visitedBugs', JSON.stringify(visitedBugs), { maxAge: 7000 })

    bugService.getById(id)
        .then(bug => { res.send(bug) })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: 'Internal Server Error' })
        })
})


app.get('/api/bug/:id/remove', (req, res) => {
    const { id } = req.params

    bugService.remove(id)
        .then(() => res.send(`bug ${id} deleted...`))
})

const port = 3031

app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))












