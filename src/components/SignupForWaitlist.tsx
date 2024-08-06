import { isMobileCheck } from "../utils/dimensions";
import NavBar from "./NavBar";
import cn from 'classnames'

export default function SignUpForWaitlist() {
    const isMobile = isMobileCheck();
    return <>
        <NavBar />
        <div className={cn('flex flex-col grow justify-center items-end self-start', {
            'ml-16 p-8 gap-8': !isMobile,
            'p-4 gap-4': isMobile
        })}>
            <h1 className={cn('self-end', {
                'text-4xl': isMobile,
                'text-6xl': !isMobile,
            })}>Waitlist</h1>
            <div>Coming Soon!</div>
        </div>
    </>
}