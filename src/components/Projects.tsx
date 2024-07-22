import NavBar from "./NavBar";
import cn from 'classnames'
import { isMobileCheck } from "../utils/dimensions";

const PROJECTS = [
    {
        title: 'Barter',
        description: 'A tool for selling your NFTs through Telegram via a gamified AI assistant chat. Uses Kinode to integrate your wallets, your chats, and your LLM assistants.',
        image: '/barter.png'
    },
    {
        title: 'Filter',
        description: 'An LLM-powered Kinode app with associated browser extension that filters your Twitter feed based on customizeable rules.',
        image: '/filter.png'
    },
    {
        title: 'Command Center',
        description: 'A user-centric hub for controlling your Telegram chats and bots. Ingest and analyze data for future use and integrations.',
        image: '/command-center.png'
    }
]

const PARTNERS = [
    { 
        title: 'MemeDeck',
        description: 'The ultimate AI-powered meme generation platform. Users can create based, viral memes in seconds. No design skills required - you just need your imagination.',
        image: '/memedeck.png',
    },
    {
        title: 'Kinode',
        description: 'Kinode OS combines the power of decentralized infrastructure with the flexibility of personal computing.',
        image: '/kinode.png'
    }
]

function ProjectPartnerCard({ project }: { project: { title: string, description: string, image: string } }) {
    const isMobile = isMobileCheck()
    return <div 
        className={cn("flex bg-gray/10 rounded-md backdrop-blur-sm", {
            'w-full gap-4 p-4': isMobile,
            'w-[45%] gap-8 p-8 self-stretch': !isMobile
        })}
    >
        <img src={project.image} alt={project.title} className={cn("rounded-md", {
            'w-32 h-32': !isMobile,
            'w-16 h-16': isMobile
        })} />
        <div className='flex flex-col gap-2'>
            <h2 className={cn({
                'text-2xl': !isMobile,
                'text-xl': isMobile
            })}>{project.title}</h2>
            <p className={cn({
                'text-lg': !isMobile
            })}>{project.description}</p>
        </div>
    </div>
}

export default function Projects() {
    const isMobile = isMobileCheck()
    return <>
        <NavBar />
        <div className={cn("flex flex-col justify-center grow self-stretch", {
            'p-8 gap-8': !isMobile,
            'p-4 gap-4': isMobile
        })}>
            <h1 className={cn({
                'text-4xl': !isMobile,
                'text-2xl': isMobile
            })}>Projects</h1>
            <div className={cn("flex flex-wrap", {
                'gap-4': isMobile,
                'gap-8': !isMobile
            })}>
                {PROJECTS.map((project, index) => (
                    <ProjectPartnerCard key={index} project={project} />
                ))}
            </div>
            <h2 className={cn({
                'text-4xl': !isMobile,
                'text-2xl': isMobile
            })}>Strategic Partners</h2>
            <div className="flex flex-wrap gap-8">
                {PARTNERS.map((partner, index) => (
                    <ProjectPartnerCard project={partner} key={index} />
                ))}
            </div>
        </div>
    </>
}