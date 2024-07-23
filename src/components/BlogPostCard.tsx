import { useNavigate } from 'react-router-dom'
import { Post } from '../types/Post'
import Chip from './Chip'


export default function BlogPostCard(props: { postData: Post }) {
    const { postData } = props
    const nav = useNavigate()
    return (
        <div className='flex flex-col gap-4 cursor-pointer' onClick={() => {
            nav(`/blog/${postData.slug}`)
        }}>
            <div className='flex flex-col gap-2'>
                <h2>{postData.title}</h2>
                <p>{postData.content.substring(0, 140)}...</p>
            </div>
            <div className='flex flex-row gap-2'>
                <p>{postData.date}</p>
                {postData.tags?.split(',').map((tag: string) => <Chip text={tag} />)}
            </div>
        </div>
    )
}