import { bugService } from '../services/bug.service.js'
import { utilService } from '../services/util.service.js'
// import { pdfService } from '../../services/pdf.service.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'

const { useState, useEffect, useRef } = React

export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
  const [pageCount, setPageCount] = useState(0)
  const [labels, setLabels] = useState([])


  const debouncedSetFilterBy = useRef(utilService.debounce(onSetFilterBy, 500))

  useEffect(() => {
    loadPageCount()
    loadLabels()
  }, [])

  useEffect(() => {
    loadBugs()
  }, [filterBy])


  function loadBugs() {
    bugService.query(filterBy)
      .then(setBugs)
      .catch(err => {
        console.error('Failed to load bugs:', err)
        showErrorMsg('cannot load bugs')
      })
  }

  function loadPageCount() {
    bugService.getPageCount()
      .then(pageCount => setPageCount(+pageCount))
      .catch(err => {
        console.log('err:', err)
        showErrorMsg('cannot get page count')
      })
  }

  function loadLabels() {
    bugService.getLabels()
      .then(labels => setLabels(labels))
      .catch(err => {
        console.log('err:', err)
        showErrorMsg('cannot load labels')
      })
  }

  function onSetFilterBy(filterBy) {
    setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy, pageIdx: 0 }))
  }

  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        console.log('Deleted Succesfully!')
        setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
        loadPageCount()
        showSuccessMsg('Bug removed')
      })
      .catch((err) => {
        console.log('Error from onRemoveBug ->', err)
        showErrorMsg('Cannot remove bug')
      })
  }

  function onAddBug() {
    const bug = {
      title: prompt('Bug title?'),
      description: prompt('Bug description?'),
      severity: +prompt('Bug severity?'),
      createdAt: new Date()
    }

    bugService.save(bug)
      .then((savedBug) => {
        console.log('Added Bug', savedBug)
        setBugs(prevBugs => [...prevBugs, savedBug])
        showSuccessMsg('Bug added')
        loadPageCount()
      })
      .catch((err) => {
        console.log('Error from onAddBug ->', err)
        showErrorMsg('Cannot add bug')
      })
  }

  function onEditBug(bug) {
    const severity = +prompt('New severity?')
    const bugToSave = { ...bug, severity }
    bugService
      .save(bugToSave)
      .then((savedBug) => {
        setBugs(prevBugs => prevBugs.map((currBug) =>
          currBug._id === savedBug._id ? savedBug : currBug
        ))
        showSuccessMsg('Bug updated')
      })
      .catch((err) => {
        console.log('Error from onEditBug ->', err)
        showErrorMsg('Cannot update bug')
      })
  }

  function onDownloadPdf() {
    bugService.downloadPdf()
      .then(() => {
        console.log('PDF DOWNLOAD')
        showSuccessMsg('Download pdf successfully')
      })
      .catch(err => {
        console.log('err:', err)
        showErrorMsg('Cannot download pdf')
      })
  }

  function onGetPage(diff) {
    let pageIdx = filterBy.pageIdx + diff
    if (pageIdx < 0) pageIdx = pageCount - 1
    if (pageIdx > pageCount - 1) pageIdx = 0
    setFilterBy(prev => ({ ...prev, pageIdx }))
  }

  return (
    <main>
      <h3>Bugs App</h3>
      <BugFilter filterBy={filterBy} onSetFilterBy={debouncedSetFilterBy.current} labels={labels}/>
      <button onClick={onDownloadPdf}>Download Bugs Pdf</button>
      <main>
        <button onClick={onAddBug}>Add Bug 🪲</button>
        <button onClick={() => onGetPage(-1)}>-</button>
        <span>{filterBy.pageIdx + 1}</span>
        <button onClick={() => onGetPage(1)}>+</button>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>
    </main>
  )
}
