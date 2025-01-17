import { useState } from "react";
import cn from 'classnames'
import { isMobileCheck } from "../utils/dimensions";
import NavBar from "./NavBar";

export default function Contact() {
    const [message, setMessage] = useState('');
    const isMobile = isMobileCheck()

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // make an anchor tag with mailto: and the email and message
        const mailto = `mailto:info@labs.kinode.org?subject=Kinode Labs Contact&body=${message}`;
        window.location.href = mailto;
    }

    return <>
        <NavBar />
        <div className={cn("flex flex-col grow items-center", {
            'p-8 gap-8': !isMobile,
            'p-4 gap-4': isMobile
        })}>
            <h1 className={cn({
                'text-4xl': !isMobile,
                'text-2xl': isMobile
            })}>Contact</h1>
            <p className={cn({
                'text-xl': !isMobile,
                'text-lg': isMobile
            })}>
                If you have any questions or feedback, please reach out.
            </p>
            <form className={cn("flex flex-col items-center gap-4", {
                'w-[500px]': !isMobile,
                'w-full': isMobile
            })} onSubmit={onSubmit}>
                <textarea
                    className={cn("self-stretch ", {
                        'min-w-[500px] min-h-[400px]': !isMobile,
                        'w-full min-h-[200px]': isMobile
                    })}
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    type="submit"
                    className="self-stretch cursor-pointer"
                >
                    Submit
                </button>
            </form>
        </div>
    </>
}