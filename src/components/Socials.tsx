import { FaDiscord, FaEnvelope, FaTwitter } from "react-icons/fa6";
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
  return <div className="flex items-center gap-4 p-xl">
    {SOCIALS.map((social, index) => (
        <a 
            href={social.url} 
            target="_blank"
            className="text-2xl text-gray"
            key={index}
        >
            <social.icon />
        </a>
    ))}
  </div>
}