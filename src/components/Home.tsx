import NavBar from "./NavBar";
import cn from 'classnames'
import { isMobileCheck } from "../utils/dimensions";

export default function Home() {
    const isMobile = isMobileCheck()
    return <>
        <NavBar />
        <div className={cn('flex flex-col grow justify-center items-end self-start', {
            'ml-16 p-8 gap-8': !isMobile,
            'p-4 gap-4': isMobile
        })}>
            <h1 className={cn('self-end display', {
                'text-4xl': isMobile,
                'text-6xl': !isMobile,
            })}>
                Uncentered <br/> Systems
                <span className="text-xs ml-1 -mr-4">&trade;</span>
            </h1>
            <p className={cn("text-justify", {
                'w-[500px] text-lg': !isMobile,
                'ml-16': isMobile
            })}>
                Uncentered Systems is a development laboratory for extensible, high-throughput Web3 applications.
                We believe that crypto should be simple, seamless, and optimized for AI.
                Fundamental tools of our stack include: Rust, Ethereum, Wasm, and the <a href="//kinode.org">Kinode platform</a>.
            </p>
        </div>
    </>
}