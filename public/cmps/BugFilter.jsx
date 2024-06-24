const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const [isAscending, setIsAscending] = useState(true)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const { name, type, value } = target

        if (type === 'checkbox') {
            setIsAscending(prevIsAscending => !prevIsAscending)
            setFilterByToEdit(prev => ({ ...prev, [name]: isAscending ? -1 : 1 }))
            return
        }

        const parsedValue = (type === 'number') ? +value : value

        setFilterByToEdit(prev => ({ ...prev, [name]: parsedValue }))
    }


    function handleLabelChange({ target }) {
        const { name } = target
        const labels = filterBy.labels || []

        if (labels.includes(name)) {
            const labelIdx = labels.findIndex(label => label === name)
            labels.splice(labelIdx, 1)
            setFilterByToEdit(prev => ({ ...prev, labels }))
            return
        }

        labels.push(name)
        setFilterByToEdit(prev => ({ ...prev, [name]: labels }))
    }

    return (
        <section className="bug-filter">
            <h1>filter the bugs</h1>
            <section className="filter-sort">
                <label htmlFor="txt">By Text: </label>
                <input type="txt" id="txt" name="txt" onInput={handleChange} /><br />

                <label htmlFor="severity">By Severity: </label>
                <input type="number" id="severity" name="severity" min={0} onChange={handleChange} /><br />

                <span >By Labels: </span><br /><br />
                <label htmlFor="backend">Backend: </label>
                <input type="checkbox" id="backend" name="backend" onChange={handleChange} />

                <label htmlFor="critical">Critical: </label>
                <input type="checkbox" id="critical" name="critical" onChange={handleLabelChange} />

                <label htmlFor="frontend">Frontend: </label>
                <input type="checkbox" id="frontend" name="frontend" onChange={handleLabelChange} />

                <label htmlFor="bug">Bug: </label>
                <input type="checkbox" id="bug" name="bug" onChange={handleLabelChange} />

                <br /><br />
                <span>Sort By: </span>
                <input type="checkbox" id="sort-dir" name="sortDir" onChange={handleChange} />
                <label htmlFor="sort-dir">{isAscending ? 'Ascending' : 'Descending'}</label>

                <select name="sortBy" id="sort-by" onChange={handleChange}>
                    <option value="select">Choose Sorting</option>
                    <option value="title">Title</option>
                    <option value="severity">Severity</option>
                    <option value="createdAt">Date</option>
                </select>
            </section>
        </section>
    )
}


