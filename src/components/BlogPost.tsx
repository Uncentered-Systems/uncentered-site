import { useState, useEffect } from "react";
import useSiteStore from "../store/siteStore";
import { Post } from "../types/Post";
import {marked} from 'marked'
import { isMobileCheck } from "../utils/dimensions";
import { useNavigate, useParams } from "react-router-dom";

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

    return (
        <div>
            {token && <div className="absolute top-0 right-0">
                <button>Edit</button>
            </div>}
            <h1>{postData?.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: postMarkdown }} />
        </div>
    )
}