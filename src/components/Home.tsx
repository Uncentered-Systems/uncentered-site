export default function Home() {
    return <div className='flex flex-col items-center justify-center h-screen w-screen bg-black text-white font-sans gap-lg'>
        <h1 className='text-4xl font-bold'>Uncentered Systems</h1>
        <div className='flex items-center bg-white/5 p-xl rounded-2xl w-full max-w-[800px] text-center text-2xl'>
            <p>
                Uncentered Systems is a development laboratory for extensible, high-throughput Web3 applications.
            </p>
        </div>
        <div className="flex gap-xl max-w-[800px]">
            <div className='flex items-center bg-white/5 p-xl rounded-2xl text-center'>
                <p>
                    We believe that crypto should be simple, seamless, and optimized for AI.
                </p>
            </div>
            <div className='flex items-center bg-white/5 p-lg rounded-2xl text-center'>
                <p>
                    Fundamental tools of our stack include: Rust, Ethereum, Wasm, and the <a href="//kinode.org">Kinode platform</a>.
                </p>
            </div>
        </div>
    </div>
}