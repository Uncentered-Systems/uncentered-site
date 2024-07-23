import useSiteStore from "../store/siteStore"
import BlogPostCard from "./BlogPostCard"

export default function Blog() {
    const { posts } = useSiteStore()

    return (
        <div>
            <h1>Blog</h1>
            {posts.map((post, i) => <BlogPostCard key={i} postData={post} />)}
        </div>
    )
}