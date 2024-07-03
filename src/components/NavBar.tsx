import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'

export default function NavBar() {
    return <div className="flex items-center justify-between p-xl">
        <div className="flex items-center gap-4">
            <Link className='text-gray' to="/">
                <img src={logo} alt="Uncentered Systems" className="w-12 h-12 opacity-50" />
            </Link>
            <Link className='text-gray' to="/">Home</Link>
            <Link className='text-gray' to="/projects">Projects</Link>
            <Link className='text-gray' to="/contact">Contact</Link>
        </div>
    </div>
}