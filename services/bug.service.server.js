
import { utilService } from './util.service.js'


export const bugService = {
    query,
    getById,
    save,
    remove,
    getPageCount,
    getLabels
}

var bugs = utilService.readJsonFile('./data/bug.json')
const PAGE_SIZE = 5

function query(filterBy) {
    var filteredBugs = bugs
    if (!filterBy) return Promise.resolve(filteredBugs)

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title) || regExp.test(bug.description))
    }
    if (filterBy.severity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.severity)
    }
    if (filterBy.userId) {
        filteredBugs = filteredBugs.filter(bug => bug.creator._id === filterBy.userId)
    }
    if (filterBy.labels?.length) {
        filteredBugs = filteredBugs.filter(bug => filterBy.labels.every(label => bug.labels.includes(label)))
    }

    // sorting
    if (filterBy.sortBy === 'title') {
        filteredBugs.sort((b1, b2) => {
            return b1.title.localeCompare(b2.title) * filterBy.sortDir
        })
    } else if (filterBy.sortBy === 'severity') {
        filteredBugs.sort((b1, b2) => {
            return (new Date(b1.severity) - new Date(b2.severity)) * filterBy.sortDir
        })
    } else if (filterBy.sortBy === 'createdAt') {
        filteredBugs.sort((b1, b2) => {
            return (new Date(b1.createdAt) - new Date(b2.createdAt)) * filterBy.sortDir
        })
    }

    // pagination
    const startIdx = filterBy.pageIdx * PAGE_SIZE
    filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)
    return Promise.resolve(filteredBugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)

    return _saveBugsToFile()
}

function save(bugToSave) {
    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs.splice(idx, 1, bugToSave)
    } else {
        bugToSave._id = utilService.makeId()
        bugs.push(bugToSave)
    }
    return _saveBugsToFile()
        .then(() => bugToSave)
}

function _saveBugsToFile() {
    return utilService.writeJsonFile('./data/bug.json', bugs)
}

function getPageCount() {
    return query().then(bugs => {
        return Math.ceil(bugs.length / PAGE_SIZE)
    })
}

function getLabels() {
    return query().then(bugs => {
        const bugsLabels = bugs.reduce((acc, bug) => {
            return [...acc, ...bug.labels]
        }, [])
        return [...new Set(bugsLabels)]
    })
}