import Socials from "./Socials";

export default function Footer() {
    return <>
        <Socials/>
        {/* {token && <div className='fixed bottom-0 right-0 flex items-center gap-2 p-4'>
            <button onClick={() => window.location.href = '/blog/new'}>New Post</button>
            <button onClick={onLogout}>Logout</button>
        </div>} */}
    </>
}