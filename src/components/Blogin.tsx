import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useSiteStore from "../store/siteStore"

export default function Blogin() {
    const { token, setToken } = useSiteStore()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const nav = useNavigate()

    useEffect(() => {
        if (token) {
            nav('/blog/new')
        }
    }, [token, nav])

    const onSubmit = () => {
        fetch('/api/blog/login', {
            method: 'POST',
            headers: {
                'Accepts': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })
        .then(data => data.json())
        .then(data => {
            if (data?.token) {
                setToken(data.token)
                nav('/blog/new')
            } else {
                alert('Incorrect username or password')
            }
        })
    }

    return (
        <div>
            <h1>Blogin</h1>
            <form onSubmit={onSubmit}>
                <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Username"
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password"
                />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}