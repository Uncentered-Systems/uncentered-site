import { useNavigate } from 'react-router-dom'
import { Post } from '../types/Post'
import Chip from './Chip'
import dayjs from 'dayjs'
import { isMobileCheck } from '../utils/dimensions'
import cn from 'classnames'

export default function BlogPostCard(props: { postData: Post }) {
    const { postData } = props
    const nav = useNavigate()
    const isMobile = isMobileCheck()
    return (
        <div
            className={cn('flex gap-4 cursor-pointer hover:bg-green/20 duration-100 transition-all bg-green/10 p-8 rounded-md shadow-md backdrop-blur-sm', {
                'max-w-[500px]': !isMobile,
                'max-w-full flex-col': isMobile
            })}
            onClick={() => {
                nav(`/blog/${postData.slug}`)
            }}
        >
            <img src={`/api/images/${postData.thumbnailImage}`} alt={postData.title} className={cn('grow rounded-md', {
                'max-h-64 max-w-64': !isMobile,
                'max-h-32': isMobile
            })} />
            <div className='flex flex-col gap-4'>
                <h1>{postData.title}</h1>
                <p>{postData.content.substring(0, 140)}{postData.content.length > 140 ? '...' : ''}</p>
                <div className='flex items-center flex-wrap gap-4'>
                    <p>{dayjs(postData.date).format('MMMM D, YYYY')}</p>
                    {postData.tags?.split(',').map((tag: string) => <Chip text={tag} />)}
                </div>
            </div>
        </div>
    )
}