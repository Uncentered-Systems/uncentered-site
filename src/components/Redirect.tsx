import { useEffect } from 'react';

interface RedirectProps {
    to: string;
}

const Redirect = ({ to }: RedirectProps) => {
    useEffect(() => {
        window.location.href = to;
    }, [to]);

    return <div className='flex flex-col grow self-stretch place-self-center place-items-center  place-content-center justify-center items-center'>
        <h1 className='text-2xl'>Redirecting...</h1>
    </div>
};

export default Redirect; 