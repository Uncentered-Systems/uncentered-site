import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'
import { isMobileCheck } from '../utils/dimensions';
import cn from 'classnames'

export default function NavBar() {
    const isMobile = isMobileCheck()
    return <div className={cn("flex items-center justify-between", {
        "p-8": !isMobile,
        "p-4": isMobile
    })}>
        <div className="flex items-center gap-8">
            <Link className='text-gray' to="/">
                <img src={logo} alt="Uncentered Systems" className="h-12 opacity-50" />
            </Link>
            <Link className='text-gray' to="/">Home</Link>
            <Link className='text-gray' to="/projects">Projects</Link>
            <Link className='text-gray' to="/contact">Contact</Link>
        </div>
    </div>
}