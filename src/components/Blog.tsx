import { useEffect } from "react"
import useSiteStore from "../store/siteStore"
import { isMobileCheck } from "../utils/dimensions"
import BlogPostCard from "./BlogPostCard"
import NavBar from "./NavBar"
import cn from 'classnames'
export default function Blog() {
    const { posts, fetchPosts } = useSiteStore()
    const isMobile = isMobileCheck()

    useEffect(() => {
        fetchPosts()
    }, [])

    return (<>
        <NavBar />
        <div className={cn('flex flex-col grow justify-center items-end self-start', {
            'ml-16 p-8 gap-8': !isMobile,
            'p-4 gap-4': isMobile
        })}>
            <h1 className={cn('self-end', {
                'text-4xl': isMobile,
                'text-6xl': !isMobile,
            })}>Blog</h1>
            {posts.map((post, i) => <BlogPostCard key={i} postData={post} />)}
        </div>
    </>)
}