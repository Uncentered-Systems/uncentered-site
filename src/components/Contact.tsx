import { useState } from "react";
import Life from "./Life";
import NavBar from "./NavBar";

export default function Contact() {
    const [message, setMessage] = useState('');

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // make an anchor tag with mailto: and the email and message
        const mailto = `mailto:info@uncentered.systems?subject=Uncentered Systems Contact&body=${message}`;
        window.location.href = mailto;
    }

    return <>
        <NavBar />
        <div className="flex flex-col self-center grow gap-xl">
            <h1 className="text-4xl font-bold">Contact</h1>
            <p className="text-xl">
            If you have any questions or feedback, please reach out.
        </p>
        <form className="flex flex-col items-center gap-4 w-[500px]" onSubmit={onSubmit}>
            <textarea
                className="self-stretch min-h-[200px]"
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