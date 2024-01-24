enum HomePages {
    forum,
    map,
    post,
    new_post
}

enum PostTypes {
    all = 'All',
    general = 'General',
    store_request = 'Store request',
    market_research = 'Market research',
}

const PostColorsDict = {
    [PostTypes.all] : "gray",
    [PostTypes.general] : "brown",
    [PostTypes.store_request] : "green",
    [PostTypes.market_research] : "orange"
}

interface PostData {
    post_id: number;
    title: string;
    topic: string;
    author: string;
    content: string;
    date: string;
}

interface CommentData {
    comment_id: number;
    author: string;
    author_id: number;
    date: string;
    content: string;
  }


export { HomePages, PostTypes, type PostData, type CommentData, PostColorsDict };