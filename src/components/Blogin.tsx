import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useSiteStore from "../store/siteStore"
import NavBar from "./NavBar"
import cn from 'classnames'
import { isMobileCheck } from "../utils/dimensions"

export default function Blogin() {
    const isMobile = isMobileCheck()
    const { token, setToken } = useSiteStore()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const nav = useNavigate()

    useEffect(() => {
        if (token) {
            nav('/blog/new')
        }
    }, [token, nav])

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
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

    return (<>
        <NavBar />
        <div className={cn('flex flex-col grow justify-center items-end self-start', {
            'ml-16 p-8 gap-8': !isMobile,
            'p-4 gap-4': isMobile
        })}>
            <h1 className={cn('self-end', {
                'text-4xl': isMobile,
                'text-6xl': !isMobile,
            })}>Blogin</h1>
            <form
                onSubmit={onSubmit}
                className={cn('flex flex-col gap-4', {
                })}
            >
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
                <button className="cursor-pointer" type="submit">Login</button>
            </form>
        </div>
    </>)
}