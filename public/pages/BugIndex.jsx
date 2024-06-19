import { bugService } from '../services/bug.service.js'
import { utilService } from '../services/util.service.js'
import { pdfService } from '../services/pdf.service.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'

const { useState, useEffect, useRef } = React

export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

  const debouncedSetFilterBy = useRef(utilService.debounce(onSetFilterBy, 500))

  useEffect(() => {
    loadBugs()
  }, [filterBy])

  function loadBugs() {
    bugService.query(filterBy).then(setBugs)
  }

  function onSetFilterBy(filterBy) {
    setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
  }

  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        console.log('Deleted Succesfully!')
        setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
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
    }
    bugService.save(bug)
      .then((savedBug) => {
        console.log('Added Bug', savedBug)
        setBugs(prevBugs => [...prevBugs, savedBug])
        showSuccessMsg('Bug added')
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

  function onPDFDownload() {
    pdfService.buildPDF('../assets/pdf/bugs.pdf', bugs)
      // .then(utilService.download('./assets/pdf/bugs.pdf', 'bugs.pdf'))
  }

  return (
    <main>
      <h3>Bugs App</h3>
      <BugFilter filterBy={filterBy} onSetFilterBy={debouncedSetFilterBy.current} />
      <button onClick={onPDFDownload}>Download Bugs Pdf</button>
      <main>
        <button onClick={onAddBug}>Add Bug 🪲</button>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>
    </main>
  )
}
