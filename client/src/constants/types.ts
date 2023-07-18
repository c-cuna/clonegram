export type Profile = {
    profile_picture: string
}

export type User = {
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    username: string,
    profile: Profile
    profile_picture: string,
    is_self: boolean,
    is_following: boolean,
}

export type CommentType = {
    user: User,
    comment: string
}

export type LikeType = {
    post: string,
    user: User
}

export type PostType = {
    id: string,
    likes: LikeType[],
    is_liked: boolean,
    profile_picture: string,
    user: User,
    image_url: string,
    description: string,
    like_count: number,
    comments: CommentType[],
    comments_count: number
}

export type IPostProps = {
    id: string,
    is_liked: string,
    profile_picture: string,
    username: string,
    first_name: string,
    last_name: string,
    image_url: string,
    like_count: string,
    likes: LikeType[],
    description: string,
    comments: string,
    comments_count: number
}

export type Notification = {
    id: string,
    is_read: boolean,
    message: string
    notification_type: string,
    post: string,
    receiver: User,
    sender: User,
    timestamp: string,
};