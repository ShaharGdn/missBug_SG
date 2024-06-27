const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'


export function BugDetails() {
    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        bugService.getById(bugId)
            .then(bug => {
                setBug(bug)
            })
            .catch(err => {
                showErrorMsg('Cannot load bug')
            })
    }, [])

    if (!bug) return <h1>loading....</h1>
    return <div className='bug-details'>
        <h1>Bug Details 🐛</h1>
        <h5>
            <span className="bold">Issue: </span>
            {bug.title}
        </h5>
        <p>
            <span className="bold">Creator: </span>
            <span>{bug.creator.fullname}</span>
        </p>
        <p>
            <span className="bold">Severity: </span>
            <span>{bug.severity}</span>
        </p>
        <p>
            <span className="bold">Description: </span>
            <span>{bug.description}</span>
        </p>
        <span className="bold">Labels: </span>

        <section className="labels">
            {bug.labels.map(label => {
                return <span>{label}  </span>
            })}
        </section>
        <Link to="/bug" className="btn-back">Back to List</Link>
    </div>
}

