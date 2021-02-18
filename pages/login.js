import React from 'react'
import catchErrors from '../utils/catchErrors'
import { handleLogin } from '../utils/auth'

const INITIAL_USER = {
    email: "",
    password: ""
}

export default function Login() {
    const [user, setUser] = React.useState(INITIAL_USER)
    const [error, setError] = React.useState("")
    
    async function handleSubmit(e) {
        e.preventDefault()
        
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            const data = await res.json()
    
            const token = data.token
            if (token) {
                handleLogin(token)
            } else {
                setError('Something went wrong')
            }
        } catch(err) {
            catchErrors(err, setError)
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setUser(prevState => ({ ...prevState, [name]: value }))
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <h2>{error}</h2>
            <input type="text" name="email" placeholder="email" value={user.email} onChange={handleChange} />
            <br />
            <input type="password" name="password" placeholder="password" value={user.password} onChange={handleChange} />
            <br />
            <input type="submit" value="Login" />
        </form>
    )
}