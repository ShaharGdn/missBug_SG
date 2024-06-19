const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const { name, type, value } = target;
        const parsedValue = (type === 'number') ? +value : value

        setFilterByToEdit({ [name]: parsedValue })
    }

    return (
        <section className="bug-filter">
            <h1>filter the bugs</h1>
            <label htmlFor="title">By Title: </label>
            <input type="text" id="title" name="title" onInput={handleChange} />
            <label htmlFor="severity">By severity: </label>
            <input type="number" id="severity" name="severity" onChange={handleChange} />
        </section>
    )
} 


