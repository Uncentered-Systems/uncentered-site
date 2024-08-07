import { useEffect, useState } from "react";
import { isMobileCheck } from "../utils/dimensions";
import NavBar from "./NavBar";
import cn from 'classnames'
import classNames from "classnames";
import { FaCircleNotch } from "react-icons/fa6";

export default function SignUpForWaitlist() {
    const isMobile = isMobileCheck();
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://js.hsforms.net/forms/v2.js";
        document.body.appendChild(script);

        script.addEventListener('load', () => {
            if ((window as any).hbspt) {
                (window as any).hbspt.forms.create({
                    region: "na1",
                    portalId: "46995186",
                    formId: "74907a29-f202-4505-9559-ea4388ba771a"
                });
                const allForms = document.getElementsByClassName('hbspt-form')
                const form = allForms[0] as HTMLDivElement
                Array.from(allForms).forEach(form => {
                    form.remove()
                })
                // move the form to form-destination
                if (form) {
                    document.getElementById('form-destination')?.appendChild(form)

                    setTimeout(() => {
                        const iframe = form.querySelector('iframe')
                        if (iframe) {
                            //inject css into iframe
                            const styleElement = document.createElement('style')
                            styleElement.innerHTML = `
                                @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
                            
                                * {
                                    font-family: 'Montserrat' !important;
                                    margin: 0;
                                    padding: 0;
                                    margin-block-end: 0;
                                }

                                .hs-richtext {
                                    font-size: 10px !important;
                                    line-height: 1.25 !important;
                                }
                            `
                            iframe.contentDocument?.body.appendChild(styleElement)
                            setIsLoading(false)
                        }
                    }, 1000)
                }
            }
        });

        return () => {
            document.body.removeChild(script);
        };
    }, []);

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
            <div id="form-destination" className={classNames("flex flex-col grow transition-opacity duration-500", {
                'opacity-0': isLoading
            })}></div>
            {isLoading && <div className="flex flex-col grow justify-center items-center absolute inset-0">
                <FaCircleNotch className="animate-spin text-2xl" />
            </div>}
        </div>
    </>
}