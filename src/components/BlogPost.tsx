import { useState, useEffect } from "react";
import useSiteStore from "../store/siteStore";
import { Post } from "../types/Post";
import { marked } from 'marked'
import { isMobileCheck } from "../utils/dimensions";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "./NavBar";
import cn from "classnames";

export default function BlogPost() {
    const slug = useParams().slug
    const nav = useNavigate()
    const [postMarkdown, setPostMarkdown] = useState('')
    const [postData, setPostData] = useState<Post | null>(null)
    const isMobile = isMobileCheck()
    const { token, posts } = useSiteStore()

    useEffect(() => {
        const postData = posts.find((post) => post.slug === slug)
        if (postData) {
            const content = marked(postData.content) as string
            setPostMarkdown(content)
            setPostData(postData)
        } else {
            nav('/blog')
        }
    }, [posts])

    return (<>
        <NavBar />
        <div className={cn('flex flex-col grow justify-center items-end self-start', {
            'ml-16 p-8 gap-8': !isMobile,
            'p-4 gap-4': isMobile
        })}>
            {token && <div className="absolute top-0 right-0">
                <button>Edit</button>
            </div>}
            <h1 className={cn('self-end', {
                'text-4xl': isMobile,
                'text-6xl': !isMobile,
            })}>
                {postData?.title}
            </h1>
            <div dangerouslySetInnerHTML={{ __html: postMarkdown }} />
        </div>
    </>
    )
}