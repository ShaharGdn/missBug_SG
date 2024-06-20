const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const labels = filterBy.labels || []
        const { name, type, value } = target;
        if (type === 'checkbox') {
            if (labels.includes(name)) {
                const labelIdx = labels.findIndex(label => label === name)
                labels.splice(labelIdx, 1)
                setFilterByToEdit(prev => ({ ...prev, labels }))
                return
            }
            labels.push(name)
            setFilterByToEdit(prev => ({ ...prev, [name]: labels }))
        }

        const parsedValue = (type === 'number') ? +value : value

        setFilterByToEdit(prev => ({ ...prev, [name]: parsedValue }))
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
                <input type="checkbox" id="critical" name="critical" onChange={handleChange} />

                <label htmlFor="frontend">Frontend: </label>
                <input type="checkbox" id="frontend" name="frontend" onChange={handleChange} />

                <label htmlFor="bug">Bug: </label>
                <input type="checkbox" id="bug" name="bug" onChange={handleChange} />
            </section>
        </section>
    )
}


