import { useState, useEffect } from "react";
import useSiteStore from "../store/siteStore";
import { Post } from "../types/Post";
import { isMobileCheck } from "../utils/dimensions";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "./NavBar";
import cn from "classnames";
import dayjs from "dayjs";
import Chip from "./Chip";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import MarkdownIt from 'markdown-it';
import footnote from 'markdown-it-footnote';

const md = new MarkdownIt().use(footnote);

export default function BlogPost() {
    const slug = useParams().slug
    const nav = useNavigate()
    const [postMarkdown, setPostMarkdown] = useState('')
    const [postData, setPostData] = useState<Post | null>(null)
    const [previousPost, setPreviousPost] = useState<Post | null>(null)
    const [nextPost, setNextPost] = useState<Post | null>(null)
    const isMobile = isMobileCheck()
    const { token, fetchPosts } = useSiteStore()

    useEffect(() => {
        fetchPosts().then((posts) => {
            const postIndex = posts.findIndex((post) => post.slug === slug)
            if (postIndex !== -1) {
                const postData = posts[postIndex]
                if (postIndex > 0) {
                    if (!posts[postIndex - 1].deleted) {
                        setPreviousPost(posts[postIndex - 1])
                    } else if (postIndex > 1) {
                        setPreviousPost(posts[postIndex - 2])
                    } else {
                        setPreviousPost(null)
                    }
                } else {
                    setPreviousPost(null)
                }
                if (postIndex < posts.length - 1) {
                    if (!posts[postIndex + 1].deleted) {
                        setNextPost(posts[postIndex + 1])
                    } else if (postIndex < posts.length - 2) {
                        setNextPost(posts[postIndex + 2])
                    } else {
                        setNextPost(null)
                    }
                } else {
                    setNextPost(null)
                }
                const content = md.render(postData.content)
                setPostMarkdown(content)
                setPostData(postData)
            } else {
                nav('/blog')
            }
        })
    }, [slug])


    const onDeletePost = () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            fetch(`/api/blog/posts/${slug}`, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            })
                .then(data => {
                    console.log({ data })
                    alert('Post deleted.')
                    nav('/blog')
                })
                .catch(err => {
                    console.log(err)
                    alert('Something went wrong. Please try again.')
                })
        }
    }

    const onUndeletePost = () => {
        if (postData && window.confirm('Are you sure you want to undelete this post?')) {
            fetch(`/api/blog/posts/${slug}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...postData, deleted: 0 })
            })
                .then(data => {
                    console.log({ data })
                    alert('Post undeleted.')
                    nav('/blog')
                })
                .catch(err => {
                    console.log(err)
                    alert('Something went wrong. Please try again.')
                })
        }
    }

    return (<>
        <NavBar />
        <div className={cn('flex flex-col grow justify-center self-start gap-4', {
            'ml-16 p-8 max-w-[900px]': !isMobile,
            'max-w-screen': isMobile
        })}>
            {token && <div className="fixed bottom-8 right-8 flex gap-4">
                <button onClick={() => nav(`/blog/${slug}/edit`)}>Edit</button>
                {postData?.deleted
                    ? <button onClick={() => onUndeletePost()}>Undelete</button>
                    : <button onClick={() => onDeletePost()}>Delete</button>}
            </div>}
            <button
                onClick={() => nav('/blog')}
                className="self-start"
            >
                Back
            </button>
            {postData?.headerImage && <img
                src={`/api/images/${postData.headerImage}`}
                alt={postData.title}
                style={{
                    aspectRatio: '16 / 9'
                }}
                className={cn('w-full', {
                })}
            />}
            <h1 className={cn({
                'mx-4 text-4xl': isMobile,
                'mr-4 text-6xl': !isMobile,
            })}>
                {postData?.title}{postData?.deleted ? <span className='text-red-500'> (Deleted)</span> : <></>}
            </h1>
            <div className={cn('flex items-center gap-2', {
                'flex-wrap mx-4': isMobile
            })}>
                {postData?.tags?.split(',').filter((tag: string) => tag !== '').map((tag: string, i: number) => <Chip text={tag} key={i} />)}
                <p className="ml-auto">{dayjs(postData?.date).format('MMMM D, YYYY')}</p>
            </div>
            <div
                dangerouslySetInnerHTML={{ __html: postMarkdown }}
                className={cn('post-content', {
                    'mx-4': isMobile
                })} />
            <div
                className="flex items-center gap-4 grow self-stretch"
            >
                <div
                    className={cn("bg-grey/10 shadow-sm rounded backdrop-blur-sm p-4 flex gap-4 cursor-pointer hover:bg-grey/20 grow self-stretch max-w-1/2 items-center", {
                        'invisible': !previousPost
                    })}
                    onClick={() => nav(`/blog/${previousPost?.slug}`)}
                >
                    <FaChevronLeft className="text-xl" />
                    <div className="flex flex-col gap-2">
                        <h3>{previousPost?.title}</h3>
                        <p>{dayjs(previousPost?.date).format('MMMM D, YYYY')}</p>
                    </div>
                </div>
                <div
                    className={cn("bg-grey/10 shadow-sm rounded backdrop-blur-sm p-4 flex gap-4 cursor-pointer hover:bg-grey/20 grow self-stretch max-w-1/2 items-center justify-end", {
                        'invisible': !nextPost
                    })}
                    onClick={() => nav(`/blog/${nextPost?.slug}`)}
                >
                    <div className="flex flex-col gap-2">
                        <h3>{nextPost?.title}</h3>
                        <p>{dayjs(nextPost?.date).format('MMMM D, YYYY')}</p>
                    </div>
                    <FaChevronRight className="text-xl" />
                </div>
            </div>
        </div>
    </>
    )
}