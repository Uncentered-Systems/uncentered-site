import NavBar from "./NavBar";
import cn from 'classnames'
import { isMobileCheck } from "../utils/dimensions";

const PROJECTS = [
    {
        title: 'Barter',
        description: 'Buy and sell NFTs by solving riddles and negotiating with a Telegram AI chatbot',
        image: '/barter.png'
    },
    {
        title: 'Filter',
        description: 'Filter your Twitter feed with AI',
        image: '/filter.png'
    },
    {
        title: 'Command Center',
        description: 'Configure AI chatbots and manage access keys for many different services',
        image: '/command-center.png'
    }
]

export default function Projects() {
    const isMobile = isMobileCheck()
    return <>
        <NavBar />
        <div className={cn("flex flex-col justify-center grow self-stretch", {
            'p-8 gap-8': !isMobile,
            'p-4 gap-4': isMobile
        })}>
            <h1 className={cn("font-bold", {
                'text-4xl': !isMobile,
                'text-2xl': isMobile
            })}>Projects</h1>
            <div className={cn("flex flex-wrap", {
                'gap-4': isMobile,
                'gap-8': !isMobile
            })}>
                {PROJECTS.map((project, index) => (
                    <div 
                        key={index} 
                        className={cn("flex bg-gray/10 rounded-md backdrop-blur-sm", {
                            'w-full gap-4 p-4': isMobile,
                            'w-[45%] gap-8 p-8 self-stretch': !isMobile
                        })}
                    >
                        <img src={project.image} alt={project.title} className={cn("self-center", {
                            'w-32 h-32': !isMobile,
                            'w-16 h-16': isMobile
                        })} />
                        <div className='flex flex-col'>
                            <h2 className={cn("font-bold", {
                                'text-2xl': !isMobile,
                                'text-xl': isMobile
                            })}>{project.title}</h2>
                            <p className={cn({
                                'text-lg': !isMobile
                            })}>{project.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
}