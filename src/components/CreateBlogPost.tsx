import { useEffect, useState } from "react"
import { Post } from "../types/Post"
import slugify from '../utils/slugify-ts'
import useSiteStore from "../store/siteStore"
import { marked } from 'marked'
import { FaChevronDown, FaChevronRight } from "react-icons/fa6"
import { useNavigate, useParams } from "react-router-dom"
import NavBar from "./NavBar"
import Chip from "./Chip"
import dayjs from "dayjs"

export default function CreateBlogPost({ editMode = false }) {
    const { token, images, fetchImageFilenames, posts } = useSiteStore()
    const { slug } = useParams()
    const nav = useNavigate()
    const [editInitialized, setEditInitialized] = useState(false)
    const [post, setPost] = useState<Post>({
        title: '',
        content: '',
        slug: '',
        date: new Date().toISOString(),
        thumbnailImage: '',
        headerImage: '',
        tags: '',
    })
    const [uploadImagesExpanded, setUploadImagesExpanded] = useState(true);
    const [imageFile, setImageFile] = useState<File | undefined>(undefined);
    const [isUploading, setIsUploading] = useState(false);
    const [markdownContent, setMarkdownContent] = useState('')

    useEffect(() => {
        if (!token) {
            nav('/login')
        }
    }, [token])

    useEffect(() => {
        if (editMode && !editInitialized) {
            const editedPost = posts.find(p => p.slug === slug)
            if (editedPost) {
                setPost(editedPost)
                setEditInitialized(true)
            } else {
                alert('Could not find post with slug ' + slug + '.')
                nav('/blog')
            }
        }
    }, [editMode, post])

    useEffect(() => {
        if (!editMode) {
            setPost({
                ...post,
                slug: slugify(post.title)
            })
        }
    }, [post.title])

    useEffect(() => {
        fetchImageFilenames()
    }, [])

    useEffect(() => {
        marked.parse(`
# ${post.title}
${post.content}`, { async: true }
        ).then((mc) => {
            setMarkdownContent(mc);
            console.log({ mc })
        })
    }, [post])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        fetch(`/api/blog/posts${editMode ? '/' + post.slug : ''}`, {
            method: editMode ? 'PUT' : 'POST',
            headers: {
                accepts: 'application/json',
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: post.title,
                content: post.content,
                thumbnailImage: post.thumbnailImage,
                headerImage: post.headerImage,
                slug: post.slug,
                tags: post.tags,
                date: +dayjs(post.date || new Date()).toDate(),
            }),
        })
            .then((data) => {
                if (data.status === 201) {
                    alert(editMode ? 'Post updated successfully!' : 'Post created successfully!');
                    console.log({ data })
                    nav('/blog');
                } else {
                    console.error({ data })
                    throw new Error('Error!')
                }
            })
            .catch((err) => {
                console.log(err);
                alert('Something went wrong. Please try again.');
            })
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

    return (<>
        <NavBar />
        <div className="flex gap-4 grow">
            <div className="flex flex-col gap-4 w-1/2 p-8">
                <button 
                    onClick={() => nav('/blog')}
                    className="self-start"
                >
                    Back
                </button>
                <h1>{editMode ? 'Edit Blog Post' : 'Create Blog Post'}</h1>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 grow"
                >
                    <input
                        type="text"
                        placeholder="Title"
                        value={post.title}
                        onChange={(e) => setPost({ ...post, title: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Thumbnail Image"
                        value={post.thumbnailImage}
                        onChange={(e) => setPost({ ...post, thumbnailImage: e.target.value.replace(/\/api\/images\/\/?/, '').trim() })}
                    />
                    <input
                        type="text"
                        placeholder="Header Image"
                        value={post.headerImage}
                        onChange={(e) => setPost({ ...post, headerImage: e.target.value.replace(/\/api\/images\/\/?/, '').trim() })}
                    />
                    <textarea
                        placeholder="Content"
                        value={post.content}
                        className="grow"
                        onChange={(e) => setPost({ ...post, content: e.target.value })}
                    />
                    {editMode && <div className="text-sm">Slug cannot be edited.</div>}
                    <input
                        type="text"
                        placeholder="Slug"
                        value={post.slug}
                        readOnly
                    />
                    <input
                        type="text"
                        placeholder="Tags"
                        value={post.tags}
                        onChange={(e) => setPost({ ...post, tags: e.target.value })}
                    />
                    <button>
                        {editMode ? 'Update' : 'Create'}
                    </button>
                </form>
                <div className="flex flex-col gap-4">
                    <div
                        className="flex cursor-pointer gap-4 items-center"
                        onClick={() => setUploadImagesExpanded(!uploadImagesExpanded)}
                    >
                        {uploadImagesExpanded && <FaChevronDown />}
                        {!uploadImagesExpanded && <FaChevronRight />}
                        <p>Upload Images</p>
                    </div>
                    {uploadImagesExpanded && <>
                        <div className='flex gap-4 ml-4'>
                            <input
                                type='file'
                                onChange={(e) => {
                                    console.log(e.target.files?.[0]);
                                    setImageFile(e.target.files?.[0]);
                                    setIsUploading(false)
                                }}
                            />
                            <button onClick={onUploadImage} disabled={isUploading || !imageFile}>Upload</button>
                        </div>
                        {images.length > 0
                            ? <p className="ml-4">Uploaded images (click to add):</p>
                            : <p className="ml-4">No images uploaded</p>
                        }
                        <div className='flex flex-wrap gap-4 overflow-y-auto ml-8 p-4'>
                            {images.filter(i => i).map((image, i) => <img
                                key={i}
                                src={`/api/images/${image}`}
                                className='w-32 h-32 cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-100'
                                onClick={() => setPost({ ...post, content: `${post.content}\n<img src="/api/images/${image}" />` })}
                            />)}
                        </div>
                    </>}
                </div>
            </div>
            <div className="flex flex-col gap-4 w-1/2 p-8">
                <h1>Preview</h1>

                <div className="flex-center gap-4">
                    {post.thumbnailImage ? <h2
                        className="object-cover"
                    >
                        Thumbnail: <img
                            className="h-32 w-32"
                            src={`/api/images/${post.thumbnailImage}`} />
                    </h2> : <h2>WARNING: No thumbnail image!</h2>}

                    {post.headerImage ? <h2
                        className="object-cover"
                    >
                        Header: <img
                            className="h-32 w-32"
                            src={`/api/images/${post.headerImage}`} />
                    </h2> : <h2>WARNING: No header image!</h2>}
                </div>

                <div className="post-content" dangerouslySetInnerHTML={{ __html: markdownContent }} />

                <div className="flex-center flex-wrap gap-2 self-start">
                    {post.tags?.split(', ').map((tag, i) => <Chip text={tag} key={i} />)}
                </div>
            </div>
        </div></>)
}