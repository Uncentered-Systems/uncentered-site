import { useEffect, useState } from "react"
import { Post } from "../types/Post"
import slugify from '../utils/slugify-ts'
import useSiteStore from "../store/siteStore"
import{ marked} from 'marked'
import { FaChevronDown, FaChevronRight } from "react-icons/fa6"

export default function CreateBlogPost() {
    const { token, images, fetchImageFilenames } = useSiteStore()
    const [post, setPost] = useState<Post>({
        title: '',
        content: '',
        slug: '',
        date: new Date().toISOString(),
        thumbnailImage: '',
        headerImage: '',
        tags: '',
    })
    const [uploadImagesExpanded, setUploadImagesExpanded] = useState(false);
    const [imageFile, setImageFile] = useState<File | undefined>(undefined);
    const [isUploading, setIsUploading] = useState(false);
    const [markdownContent, setMarkdownContent] = useState('')

    useEffect(() => {
        setPost({
            ...post,
            slug: slugify(post.title)
        })
    }, [post.title])

    useEffect(() => {
        fetchImageFilenames()
    }, [images])

    useEffect(() => {
        const mc = marked(`
<h1>${post.title}</h1>
${post.content}`
        ) as string;
        setMarkdownContent(mc);
    }, [post])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(post)
    }

    const onUploadImage = async () => {
        if (!imageFile) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', imageFile);
        const resp = await fetch(`/api/blog/images`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        })

        if (resp.status === 201) {
            alert('Image uploaded successfully!');
            setIsUploading(false);
            fetchImageFilenames();
            setImageFile(undefined);
        } else {
            alert('Something went wrong. Please try again.');
            setIsUploading(false);
        }
    }

    return (
        <div className="flex gap-4">
            <div className="flex flex-col gap-4">
                <h1>Create Blog Post</h1>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Title" 
                        value={post.title} 
                        onChange={(e) => setPost({ ...post, title: e.target.value })} 
                    />
                    <textarea 
                        placeholder="Content" 
                        value={post.content} 
                        onChange={(e) => setPost({ ...post, content: e.target.value })} 
                    />
                    <input 
                        type="text" 
                        placeholder="Slug" 
                        value={post.slug} 
                        readOnly
                    />
                    <button>Create</button>
                </form>
                <div className="flex flex-col gap-4">
                    <div 
                        className="flex cursor-pointer" 
                        onClick={() => setUploadImagesExpanded(!uploadImagesExpanded)} 
                    >
                        {uploadImagesExpanded && <FaChevronDown />}
                        {!uploadImagesExpanded && <FaChevronRight />}
                        <p>Upload Images</p>
                    </div>
                    {uploadImagesExpanded && <div className='flex gap-4'>
                        <input 
                            type='file' 
                            onChange={(e) => { console.log(e.target.files?.[0]); setImageFile(e.target.files?.[0]) }} 
                        />
                        <button onClick={onUploadImage} disabled={isUploading || !imageFile}>Upload</button>
                        <p>Uploaded images (click to add):</p>
                        <div className='flex flex-wrap gap-2'>
                            {images.filter(i => i).map((image) => <img
                                src={`/api/images/${image}`}
                                className='uploaded-image'
                                onClick={() => setPost({ ...post, content: `${post.content}\n<img src="/api/images/${image}" />` })}
                            />)}
                        </div>
                    </div>}
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <h1>Preview</h1>
                <div dangerouslySetInnerHTML={{ __html: markdownContent }} />
            </div>
        </div>
    )
}