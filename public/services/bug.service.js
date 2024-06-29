const BASE_URL = '/api/bug'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getEmptyBug,
    getLabels,
    getPageCount,
    downloadPdf
}

function query(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + '/' + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + '/' + bugId)
        .then(res => res.data)
}

function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL + '/' + bug._id, bug)
            .then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug)
            .then(res => res.data)
    }
}

function getEmptyBug() {
    return { title: '', description: '', severity: 0 }
}

function getDefaultFilter() {
    return {
        txt: '',
        severity: 0,
        labels: [],
        sortBy: '',
        sortDir: 1,
        pageIdx: 0
    }
}

function getLabels() {
    return axios.get(BASE_URL + '/labels').then(res => res.data)
}

function getPageCount() {
    return axios.get(BASE_URL + '/pageCount').then(res => res.data)
}

function downloadPdf() {
    return axios.get(BASE_URL + '/download')
        .then(res => res.data)
}