import { useNavigate } from 'react-router-dom'
import { Post } from '../types/Post'
import Chip from './Chip'


export default function BlogPostCard(props: { postData: Post }) {
    const { postData } = props
    const nav = useNavigate()
    return (
        <div
            className='flex flex-col gap-4 cursor-pointer hover:bg-green/20 duration-100 transition-all bg-green/10 p-8 rounded-md shadow-md backdrop-blur-sm'
            onClick={() => {
                nav(`/blog/${postData.slug}`)
            }}
        >
            <div className='flex flex-col gap-4'>
                <h2>{postData.title}</h2>
                <p>{postData.content.substring(0, 140)}{postData.content.length > 140 ? '...' : ''}</p>
            </div>
            <div className='flex-center gap-4'>
                <p>{postData.date}</p>
                {postData.tags?.split(',').map((tag: string) => <Chip text={tag} />)}
            </div>
        </div>
    )
}