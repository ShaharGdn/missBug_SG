import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.server.js'
import { loggerService } from './services/logger.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        labels: req.query.labels || [],
        createdAt: +req.query.createdAt || 0,
        severity: +req.query.severity || 0,
        pageIdx: +req.query.pageIdx || 0,
        sortBy: req.query.sortBy || '',
        sortDir: req.query.sortDir || 1
    }

    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .then(bugs => console.log('bugs:', bugs))
        .catch(err => {
            loggerService.error(`Couldn't get bugs...`)
            console.log('err:', err)
            res.status(500).send(`Couldn't get bugs...`)
        })
})

app.get('/api/bug/labels', (req, res) => {
    bugService.getLabels()
        .then(labels => res.send(labels))
        .catch(err => {
            loggerService.error(`Couldn't get labels`, err)
            res.status(500).send(`Couldn't get labels`)
        })
})

app.get('/api/bug/pageCount', (req, res) => {
    bugService.getPageCount()
        .then(pageCount => res.send(pageCount + ''))
        .catch(err => {
            loggerService.error(`Couldn't get pageCount`, err)
            res.status(500).send(`Couldn't get pageCount`)
        })
})

app.get('/api/bug/download', (req, res) => {
    const doc = new PDFDocument()
    doc.pipe(fs.createWriteStream('bugs.pdf'))
    doc.fontSize(25).text('BUGS LIST').fontSize(16)

    bugService.query()
        .then((bugs) => {
            bugs.forEach((bug) => {
                const bugTxt = `${bug.title}: ${bug.description}. (severity: ${bug.severity})`
                doc.text(bugTxt)
            })

            doc.end()
            res.end()
        })
})

app.get('/api/bug/:id', (req, res) => {
    console.log('hi')
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

app.put('/api/bug/:id', (req, res) => {
    const { _id, title, severity, description, createdAt, labels } = req.body
    const bugToSave = {
        _id,
        title,
        severity: +severity,
        description,
        createdAt: +createdAt,
        labels: labels || []
    }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
})

app.post('/api/bug', (req, res) => {
    const { title, severity, description, createdAt, labels } = req.body
    const bugToSave = {
        title,
        severity: +severity,
        description,
        createdAt: +createdAt,
        labels: labels || []
    }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
})


app.delete('/api/bug/:id', (req, res) => {
    const { id } = req.params

    bugService.remove(id)
        .then(() => res.send(`bug ${id} deleted...`))
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3030
app.listen(PORT,
    () => loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`))










