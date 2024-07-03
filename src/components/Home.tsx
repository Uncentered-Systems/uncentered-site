import Life from "./Life";
import NavBar from "./NavBar";

export default function Home() {
    return <>
        <NavBar />
        <div className='flex flex-col items-center w-full grow gap-5xl justify-center'>
            <h1 className='text-6xl font-bold -ml-6xl'>Uncentered Systems</h1>
            <p className="text-justify text-lg w-[500px]">
            Uncentered Systems is a development laboratory for extensible, high-throughput Web3 applications.
            We believe that crypto should be simple, seamless, and optimized for AI.
            Fundamental tools of our stack include: Rust, Ethereum, Wasm, and the <a href="//kinode.org">Kinode platform</a>.
            </p>
        </div>
    </>
}