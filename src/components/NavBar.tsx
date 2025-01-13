import { Link } from 'react-router-dom';
import { isMobileCheck } from '../utils/dimensions';
import cn from 'classnames'

export default function NavBar({ suppressWordmark = false }) {
    const isMobile = isMobileCheck()
    return <div className={cn("flex items-center justify-between", {
        "p-8": !isMobile,
        "p-4": isMobile
    })}>
        <div className={cn("flex items-center w-full", {
            'gap-4 flex-wrap': isMobile,
            'gap-8': !isMobile
        })}>
            <Link className='cursor-pointer text-gray' to="/">
                <img src='/favicon.svg' alt="Kinode Labs" className="h-12 unrounded" />
            </Link>
            <Link className='cursor-pointer text-gray' to="/">Home</Link>
            <Link className='cursor-pointer text-gray' to="/projects">Projects</Link>
            <Link className='cursor-pointer text-gray' to="/blog">Blog</Link>
            <Link title='Kinode Provider Network' className='cursor-pointer text-gray' to="/kpn">KPN</Link>
            <Link className='cursor-pointer text-gray' to="/contact">Contact</Link>
            <Link className='cursor-pointer text-gray' to="https://valet.uncentered.systems">Valet</Link>
            {!isMobile && !suppressWordmark && <img src='/Klabs-Wordmark.svg' alt="Kinode Labs" className="h-12 object-contain unrounded ml-auto" />}
        </div>
    </div>
}