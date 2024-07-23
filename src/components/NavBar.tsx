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
        <div className={cn("flex items-center", {
            'gap-4 flex-wrap': isMobile,
            'gap-8': !isMobile
        })}>
            <Link className='cursor-pointer text-gray' to="/">
                <img src={logo} alt="Uncentered Systems" className="h-12 opacity-50 unrounded" />
            </Link>
            <Link className='cursor-pointer text-gray' to="/">Home</Link>
            {/* <Link className='cursor-pointer text-gray' to="/blog">Blog</Link> */}
            <Link className='cursor-pointer text-gray' to="/projects">Projects</Link>
            <Link className='cursor-pointer text-gray' to="/contact">Contact</Link>
        </div>
    </div>
}