import { FaDiscord, FaEnvelope, FaTwitter } from "react-icons/fa6";
import cn from 'classnames'
import { isMobileCheck } from "../utils/dimensions";

const SOCIALS = [
    {
        icon: FaTwitter,
        url: "https://twitter.com/UncenteredSys"
    },
    {
        icon: FaDiscord,
        url: "https://discord.gg/7zTZYrhQwf"
    },
    {
        icon: FaEnvelope,
        url: "/contact"
    }
]

export default function Socials() {
    const isMobile = isMobileCheck()
    return <div className={cn("flex items-center gap-4", {
        'p-8': !isMobile,
        'p-4': isMobile
    })}>
    {SOCIALS.map((social, index) => (
        <a 
            href={social.url} 
            target="_blank"
            className={cn("text-gray", {
                'text-2xl': !isMobile,
                'text-xl': isMobile
            })}
            key={index}
        >
            <social.icon />
        </a>
    ))}
  </div>
}