
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

// const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug'
export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
}


function query(filterBy = {}) {
    // return storageService.query(STORAGE_KEY)
    return axios.get(BASE_URL)
        .then((res) => res.data)
        .then((bugs) => {
            if (filterBy.title) {
                const regExp = new RegExp(filterBy.title, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }

            if (filterBy.description) {
                const regExp = new RegExp(filterBy.description, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.description))
            }

            if (filterBy.severity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.severity)
            }

            return bugs
        })
}
function getById(bugId) {
    // return storageService.get(STORAGE_KEY, bugId)
    return axios.get(BASE_URL + '/' + bugId)
        .then((res) => res.data)



}
function remove(bugId) {
    return axios.get(BASE_URL + '/' + bugId + '/remove')
        .then(res => res.data)
}
function save(bug) {
    const queryString = `/save/?&title=${bug.title}&severity=${bug.severity}&description=${bug.description}`
    return axios.get(BASE_URL + queryString)
        .then(res => res.data)
}

function getDefaultFilter() {
    return { title: '', description: '', severity: 0 }
}




