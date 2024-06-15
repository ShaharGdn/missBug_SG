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
    }

    // function handleTxtChange({ target }) {
    //     const value = target.value
    //     setFilterByToEdit(prevFilter => ({ ...prevFilter, txt: value }))
    // }

    // function handleMinSpeedChange({ target }) {
    //     const value = target.value
    //     setFilterByToEdit(prevFilter => ({ ...prevFilter, minSpeed: value }))
    // }


    const { title, description, severity } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Filter Our Bugss</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="title">Vendor: </label>
                <input value={title} onChange={handleChange} type="text" placeholder="By title" id="title" name="title" />

                <label htmlFor="description">Vendor: </label>
                <input value={description} onChange={handleChange} type="text" placeholder="By description" id="description" name="description" />

                <label htmlFor="severity">Min Speed: </label>
                <input value={severity} onChange={handleChange} type="number" placeholder="By severity" id="severity" name="severity" />

                <button>Set Filter</button>
            </form>
        </section>
    )
}