const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy, labels: availableLabels }) {
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

    const { txt, severity, sortBy, sortDir, labels } = filterByToEdit

    return (
        <section className="bug-filter">
            <h1>filter the bugs</h1>
            <section className="filter-sort">
                <label htmlFor="txt">By Text: </label>
                <input
                    type="txt"
                    id="txt"
                    name="txt"
                    value={txt}
                    onInput={handleChange} />

                <label htmlFor="severity">By Severity: </label>
                <input
                    type="number"
                    id="severity"
                    name="severity"
                    min={0}
                    value={severity}
                    onChange={handleChange} />
                <div>
                    <h3>Labels:</h3>
                    {availableLabels.map(label => (
                        <label key={label}>
                            <input
                                type="checkbox"
                                name={label}
                                checked={labels.includes(label)}
                                onChange={handleLabelChange}
                            />
                            {label}
                        </label>
                    ))}
                </div>

                <span>Sort By: </span>
                <input
                    type="checkbox"
                    id="sort-dir"
                    name="sortDir"
                    value={sortDir}
                    onChange={handleChange} />

                <label htmlFor="sort-dir">{isAscending ? 'Ascending' : 'Descending'}</label>

                <select
                    name="sortBy"
                    id="sort-by"
                    onChange={handleChange}
                    value={sortBy}>
                    <option value="select">Choose Sorting</option>
                    <option value="title">Title</option>
                    <option value="severity">Severity</option>
                    <option value="createdAt">Date</option>
                </select>
            </section>
        </section>
    )
}


