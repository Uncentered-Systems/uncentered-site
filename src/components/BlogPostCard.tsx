import { useNavigate } from 'react-router-dom'
import { Post } from '../types/Post'
import Chip from './Chip'
import dayjs from 'dayjs'
import { isMobileCheck } from '../utils/dimensions'
import cn from 'classnames'
import { marked } from 'marked'
import { useEffect, useState } from 'react'

export default function BlogPostCard(props: { postData: Post }) {
    const { postData } = props
    const nav = useNavigate()
    const isMobile = isMobileCheck()
    const [markedPost, setMarkedPost] = useState<string>('')
    useEffect(() => {
        setMarkedPost(marked(postData.content) as string)
    }, [postData.content])
    return (
        <div
            className={cn('flex gap-4 cursor-pointer hover:bg-green/20 duration-100 transition-all bg-green/10 p-8 rounded-md shadow-md backdrop-blur-sm self-end', {
                'max-w-[900px] min-w-[500px]': !isMobile,
                'max-w-full flex-col': isMobile,
                'hue-rotate-180': postData.deleted
            })}
            onClick={() => {
                nav(`/blog/${postData.slug}`)
            }}
        >
            <img
                src={`/api/images/${postData.thumbnailImage}`}
                alt={postData.title}
                className={cn('grow rounded-md object-contain', {
                    'max-h-64 max-w-64': !isMobile,
                    'max-h-32': isMobile,
                    'hue-rotate-180': postData.deleted
                })}
            />
            {postData.deleted ? <button className='absolute bg-green top-8 right-8'>Deleted</button> : <></>}
            <div className='flex flex-col gap-4 grow'>
                <h1>{postData.title}{postData.deleted ? <span className='text-red-500'> (Deleted)</span> : <></>}</h1>
                <p>{dayjs(postData.date).format('MMMM D, YYYY')}</p>
                {postData.byline
                    ? <p>{postData.byline}</p>
                    : <div
                        dangerouslySetInnerHTML={{
                            __html: markedPost.substring(0, 140) + (markedPost.length > 140 ? '...' : '')
                        }}
                    />}
                <div className='flex items-center flex-wrap gap-4'>
                    {postData.tags?.split(',').filter((tag: string) => tag !== '').map((tag: string, i: number) => <Chip text={tag} key={i} />)}
                </div>
            </div>
        </div>
    )
}