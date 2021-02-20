import React from 'react'
import Link from 'next/link'
import { handleLogin } from '../utils/auth'

const INITIAL_USER = {
  name: "",
  email: "",
  password: ""
}

function Signup() {
  const [user, setUser] = React.useState(INITIAL_USER)
  const [error, setError] = React.useState("")
  
  function handleChange(event) {
    const { name, value } = event.target;
    setUser(prevState => ({ ...prevState, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
        const res = await fetch('/api/signup', {
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
            setError(data.msg)
        }
    } catch(err) {
      setError(err)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
        <h2>{error}</h2>
        <input type="text" name="name" placeholder="name" value={user.name} onChange={handleChange} />
        <br />
        <input type="text" name="email" placeholder="email" value={user.email} onChange={handleChange} />
        <br />
        <input type="password" name="password" placeholder="password" value={user.password} onChange={handleChange} />
        <br />
        <input type="submit" value="Login" />
    </form>
)
}

export default Signup;
