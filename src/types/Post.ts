export interface Post {
    slug: string,
    title: string,
    date: string,
    thumbnailImage: string,
    headerImage: string,
    content: string
    deleted?: number
    tags?: string
}

