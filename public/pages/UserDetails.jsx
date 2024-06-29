import { BugList } from "../cmps/BugList.jsx"
import { bugService } from "../services/bug.service.js"
import { userService } from "../services/user.service.js"

const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM

export function UserDetails() {
    const [user, setUser] = useState(null)
    const [bugs, setBugs] = useState(null)

    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
        getUserBugs()
    }, [params.userId])

    // useEffect(() => {
    //     getUserBugs()
    // }, [user._id])


    function loadUser() {
        userService.get(params.userId)
            .then(setUser)
            .catch(err => {
                console.log('err:', err)
                navigate('/')
            })
    }

    function onBack() {
        navigate('/')
    }

    function getUserBugs() {
        bugService.query({ userId: params.userId })
            .then(userBugs => {
                setBugs(userBugs.data)
                // setBugs(userBugs)
            })
            .catch(err => {
                console.error('Failed to load bugs:', err)
            })
    }

    function onRemoveBug(bugId) {
    }


    function onEditBug(bug) {
    }


    if (!user) return <div>Loading...</div>
    return (
        <section className="user-details">
            <h1>User {user.fullname}</h1>
            <pre>
                {JSON.stringify(user, null, 2)}
            </pre>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim rem accusantium, itaque ut voluptates quo? Vitae animi maiores nisi, assumenda molestias odit provident quaerat accusamus, reprehenderit impedit, possimus est ad?</p>

            {bugs && <BugList bugs={bugs} onEditBug={onEditBug} onRemoveBug={onRemoveBug} />}
            <button onClick={onBack} >Back</button>
        </section>
    )
}