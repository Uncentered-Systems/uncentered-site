import NavBar from "./NavBar";
import cn from 'classnames'
import { isMobileCheck } from "../utils/dimensions";

export default function Home() {
    const isMobile = isMobileCheck()
    return <>
        <NavBar />
        <div className={cn('flex flex-col grow w-full justify-center', {
            'p-8 gap-8': !isMobile,
            'p-4 gap-4': isMobile
        })}>
            <h1 className={cn('font-bold', {
                'text-6xl': !isMobile,
                'text-4xl': isMobile
            })}>Uncentered Systems</h1>
            <p className={cn("text-justify", {
                'w-[500px] text-lg': !isMobile,
                'w-full pl-4': isMobile
            })}>
            Uncentered Systems is a development laboratory for extensible, high-throughput Web3 applications.
            We believe that crypto should be simple, seamless, and optimized for AI.
            Fundamental tools of our stack include: Rust, Ethereum, Wasm, and the <a href="//kinode.org">Kinode platform</a>.
            </p>
        </div>
    </>
}