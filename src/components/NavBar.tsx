import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'
import { isMobileCheck } from '../utils/dimensions';
import cn from 'classnames'
import useSiteStore from '../store/siteStore';

export default function NavBar() {
    const isMobile = isMobileCheck()
    const {token} = useSiteStore()
    return <div className={cn("flex items-center justify-between", {
        "p-8": !isMobile,
        "p-4": isMobile
    })}>
        <div className={cn("flex items-center w-3/4", {
            'gap-4 flex-wrap': isMobile,
            'gap-8': !isMobile
        })}>
            <Link className='cursor-pointer text-gray' to="/">
                <img src={logo} alt="Uncentered Systems" className="h-12 unrounded" />
            </Link>
            <Link className='cursor-pointer text-gray' to="/">Home</Link>
            {token && <Link className='cursor-pointer text-gray' to="/blog">Blog</Link>}
            <Link className='cursor-pointer text-gray' to="/projects">Projects</Link>
            <Link className='cursor-pointer text-gray' to="/contact">Contact</Link>
            {!isMobile && <img src='/Green Wordmark.svg' alt="Uncentered Systems" className="h-14 object-contain unrounded mx-auto" />}
        </div>
    </div>
}