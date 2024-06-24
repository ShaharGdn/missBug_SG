
import { utilService } from './util.service.js'

var bugs = utilService.readJsonFile('./data/bug.json')

export const bugService = {
    query,
    getById,
    save,
    remove,
}

const PAGE_SIZE = 5

function query(filterBy) {
    var filteredBugs = bugs

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title) || regExp.test(bug.description))
    }
    if (filterBy.severity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.severity)
    }
    if (filterBy.labels.length) {
        filteredBugs = filteredBugs.filter(bug => {
            return filterBy.labels.every(label => bug.labels.includes(label));
        })
    }
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

    if (filterBy.pageIdx < 0) {
        return filterBy.pageIdx = 0
    }
    if (filterBy.pageIdx > (Math.ceil(bugs.length / PAGE_SIZE) - 1)) {
        return filterBy.pageIdx = 0
    }

    const startIdx = filterBy.pageIdx * PAGE_SIZE
    filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)


    const bugsData = {
        totalBugsCount: bugs.length,
        data: filteredBugs
    }

    return Promise.resolve(bugsData)
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
