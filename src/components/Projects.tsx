import NavBar from "./NavBar";
import cn from 'classnames'
import { isMobileCheck } from "../utils/dimensions";
import { FaLink } from "react-icons/fa6";

const PROJECTS = [
    {
        title: 'Valet',
        description: 'Valet is an all-in-one hosting suite for managing a set of Kinode instances.',
        image: '/valet.png',
        link: 'https://valet.kinode.org'
    },
    {
        title: 'Dial',
        description: 'Read and curate the best content from anywhere.',
        image: '/dial.png',
        link: 'https://dial.online'
    },
    {
        title: 'KPN',
        description: 'The Kinode Provider Network offers AI image embeddings to app developers.',
        image: '/filter.png',
        link: '/kpn'
    },
]

const PARTNERS = [
    {
        title: 'MemeDeck',
        description: 'The ultimate AI-powered meme generation platform. Users can create based, viral memes in seconds. No design skills required - you just need your imagination.',
        image: '/memedeck-tr.png',
    },
    {
        title: 'Kinode',
        description: 'Kinode OS combines the power of decentralized infrastructure with the flexibility of personal computing.',
        image: '/kinode-tr.png'
    }
]

function ProjectPartnerCard({ project }: { project: { title: string, description: string, image: string, link?: string } }) {
    const isMobile = isMobileCheck()
    return <div
        className={cn("flex bg-gray/10 rounded-md backdrop-blur-sm relative", {
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
            })}>
                {project.link ? <a
                    href={project.link}
                    target="_blank"
                    className="flex items-center gap-2"
                >
                    <span>{project.title}</span>
                    <FaLink className="text-2xl" />
                </a> : <>
                    {project.title}
                </>}
            </h2>
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
            'p-8 gap-8 max-w-[1200px]': !isMobile,
            'p-4 gap-4': isMobile
        })}>
            <h1 className={cn('text-right', {
                'text-5xl': !isMobile,
                'text-2xl': isMobile
            })}>Projects</h1>
            <div className={cn("flex flex-wrap justify-end", {
                'gap-4': isMobile,
                'gap-8': !isMobile
            })}>
                {PROJECTS.map((project, index) => (
                    <ProjectPartnerCard key={index} project={project} />
                ))}
            </div>
            <h2 className={cn('text-right', {
                'text-5xl': !isMobile,
                'text-2xl': isMobile
            })}>Strategic Partners</h2>
            <div className="flex flex-wrap gap-8 justify-end">
                {PARTNERS.map((partner, index) => (
                    <ProjectPartnerCard project={partner} key={index} />
                ))}
            </div>
        </div>
    </>
}