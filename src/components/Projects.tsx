import NavBar from "./NavBar";

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
    return <>
        <NavBar />
        <div className="flex flex-col items-center justify-center grow gap-3xl">
            <h1 className="text-4xl font-bold">Projects</h1>
            <div className='flex flex-wrap gap-xl items-center justify-center'>
                {PROJECTS.map((project, index) => (
                    <div 
                        key={index} 
                        className="flex gap-xl w-[40%] bg-gray/10 rounded-md p-xl backdrop-blur-sm self-stretch"
                    >
                        <img src={project.image} alt={project.title} className="self-center w-32 h-32" />
                        <div className='flex flex-col'>
                            <h2 className="text-2xl font-bold">{project.title}</h2>
                            <p className="text-lg">{project.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
}