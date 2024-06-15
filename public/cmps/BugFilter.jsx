const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)


    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
        console.log('filterByToEdit:', filterByToEdit)
    }

    const { title, description, severity } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Filter Our Bugs</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="title">Title: </label>
                <input value={title} onChange={handleChange} type="text" placeholder="By title" id="title" name="title" />

                <label htmlFor="description">Description: </label>
                <input value={description} onChange={handleChange} type="text" placeholder="By description" id="description" name="description" />

                <label htmlFor="severity"> Severity: </label>
                <input value={severity} onChange={handleChange} type="number" placeholder="By severity" id="severity" name="severity" />

                <button>Set Filter</button>
            </form>
        </section>
    )
}