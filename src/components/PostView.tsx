import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, ListItem, ListItemText, Paper, Stack, TextField, Toolbar, Typography } from '@mui/material';
import { CommentData, PostColorsDict, PostData, PostTypes } from '../Global';
import { deleteComment, getPostAndComments, newComment, updateComment } from '../scripts/BackendComm';
import { FORUM_PAGE_CHUNK_SIZE } from '../Const';
import { AuthContext } from './AuthContext';


const chunkSize = FORUM_PAGE_CHUNK_SIZE;


interface RenderPostProps {
    data: PostData;
}

const RenderPost: React.FC<RenderPostProps> = ({ data }) => {
    const { title, topic, author, content, date } = data;
    function getKeyByValue(value: string, enumType: { [s: string]: string }): string | undefined {
        return Object.keys(enumType).find(key => enumType[key] === value);
    }
    const typeEnum = getKeyByValue(topic, PostTypes);
    if (typeEnum == undefined){
        return null;
    }
    const typeColor = PostColorsDict[topic as keyof typeof PostColorsDict];
    return (
        <Stack direction="column" spacing={1} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Typography variant="h4" component="h2">
                {title}
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
                <Typography component="span" style={{ color: typeColor, fontWeight: 'bold' }}>
                    {topic}
                </Typography>
                <Typography component="span" sx={{ mx: 1 }}>
                    &bull; Posted by {author} &bull; Date: {date}
                </Typography>
            </Box>
            <Box sx={{ mt: 2, p: 2, borderRadius: '8px',
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center'
                }} >
                <Typography 
                    style={{ 
                        fontWeight: 'bold', 
                        fontSize: '1.2rem', 
                        whiteSpace: 'pre-line',
                        maxHeight: '10em',
                        maxWidth: '80%',
                        wordWrap: 'break-word',
                        overflowY: 'auto',
                        textAlign: 'left',
                    }}
                >
                    {content}
                </Typography>
            </Box>
        </Stack>
    );
}


// function RenderComment(isSignedIn: boolean, user_id: number, post_id: number, data: CommentData, 
//     fetchCommentsCallback: () => void){

interface RenderCommentProps {
    isSignedIn: boolean;
    user_id: number;
    post_id: number;
    data: CommentData;
    fetchCommentsCallback: () => void;
}

const RenderComment: React.FC<RenderCommentProps> = 
    ({ isSignedIn, user_id, post_id, data, fetchCommentsCallback }) => {
    const { comment_id, author, author_id, date, content } = data;
    const isAuthor = (user_id === author_id);

    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handlePublishUpdate = () => {
        updateComment(post_id, comment_id, editedContent).then(reply => {
            if (reply.error) {
                console.error(reply.error);
                window.alert(reply.error);
                return;
            }    
            setIsEditing(false);
            fetchCommentsCallback();
            window.alert("Comment updated!");
        });
    };

    const handleDelete = () => {
        deleteComment(post_id, comment_id).then(reply => {
            if (reply.error) {
                console.error(reply.error);
                window.alert(reply.error);
                return;
            }
            fetchCommentsCallback();
            window.alert("Comment deleted!");
        });
    };


    return (
        <ListItem sx={{border: '1px solid blue'}} key={comment_id} component="div">
            <Stack direction="row" spacing={2}>
            {isEditing ? (
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                    />
                ) : (
                    <ListItemText 
                        primary={<Typography variant="h6">{content}</Typography>} 
                        secondary={`Posted by ${author}. Date: ${date}`}
                    />
                )}
                {isSignedIn && isAuthor && (
                    <Box>
                        {isEditing ? (
                            <Button onClick={handlePublishUpdate} size="small">Publish Update</Button>
                        ) : (
                            <>
                                <Button onClick={handleEdit} size="small">Update</Button>
                                <Button onClick={handleDelete} size="small">Delete</Button>
                            </>
                        )}
                    </Box>
                )}
            </Stack>
        </ListItem>
    );
}


function PostView() {
    const { post_id } = useParams();
    const post_idNum = parseInt(post_id || '');
    const { isSignedIn, user_id } = useContext(AuthContext);
  
    const [post, setPost] = useState<PostData | null>(null);
    const [comments, setComments] = useState<CommentData[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalComments, setTotalComments] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [hasQueried, setHasQueried] = useState<boolean>(false);
    const [commentText, setCommentText] = useState('');
    const navigate = useNavigate();

    // needed to be wrapped in useCallback to prevent infinite loop
    const fetchComments = useCallback(() => {
        const offset = Math.max(0, (currentPage - 1)); // do not multiply by chunksize here, that is done in the back end

        if (!post_id) {
            navigate('/forum');
            return;
        }
        getPostAndComments(post_idNum, offset, chunkSize).then(reply => {
            setHasQueried(true);
            if (reply.error) {
                console.error(reply.error);
                navigate('/forum');
                return;
            }
            if (!reply.data.post) {
                console.error("No post returned");
                navigate('/forum');
                return;
            }
            setPost(reply.data.post);
            setComments(reply.data.comments);
            setTotalComments(reply.data.comment_count);
            const tempTotal = Math.ceil(reply.data.comment_count / chunkSize);
            // keep as a variable, potentially more math.
            // setTotalPages does not reflect immediately
            setTotalPages(tempTotal);
            if (tempTotal == 0){
                setCurrentPage(1); // no comments
            } else if (currentPage > tempTotal){ // last page no longer exists, probably due to a comment delete
                setCurrentPage(tempTotal);
            }
        });
    }, [currentPage, post_id, post_idNum, navigate]);

    useEffect(() => {
        fetchComments();
    }, [currentPage, fetchComments, post_id]);

    const handlePostComment = () => {
        if (post_id == undefined) {
            navigate('/forum');
            return;
        }
        newComment(post_id, commentText).then(reply => {
            if (reply.error) {
                console.error(reply.error);
                window.alert(reply.error);
                setComments([]);
                setTotalComments(0);
                setTotalPages(0);
                return;
            }
            // do not update with setComments here
            window.alert("New comment posted!");
            fetchComments();
        });
        setCommentText('');
    };

    return (
        <div>
            <div>
                {post && 
                <RenderPost
                    data = {post}
                    />}
            </div>
            <div>
                {
                    (!comments || comments.length === 0) ?
                        ( hasQueried ? (
                            <div>No comments found</div>
                        ) : (
                            <div>Loading...</div>
                        )
                    ) : comments.map((commentData: CommentData) => (
                        <RenderComment
                            key={commentData.comment_id}
                            isSignedIn={isSignedIn}
                            user_id={user_id}
                            post_id={post_idNum}
                            data={commentData}
                            fetchCommentsCallback={fetchComments}
                        />
                    ))
                }
            </div>
            <Box display="flex" justifyContent="center" m={2}>
                <Button
                    disabled={totalPages <= 0 ||currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Previous
                </Button>
                <strong>{currentPage}</strong>
                <Button 
                    disabled={totalPages <= 0 ||currentPage === totalPages || currentPage * chunkSize >= totalComments} 
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next
                </Button>
            </Box>
            {isSignedIn &&
            <Paper
            sx={{
                position: 'relative', // Adjust this as necessary
                width: '100%', // Match the width of your content
                mt: 2, // Margin top for spacing
                padding: '6px 10px',
            }}
            elevation={3}
            >
                <Toolbar>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        sx={{ mr: 1, backgroundColor: 'background.paper' }}
                    />
                    <Button
                        variant="contained"
                        onClick={handlePostComment}
                        disabled={!commentText.trim()}
                    >
                        Comment
                    </Button>
                </Toolbar>
            </Paper>
            }
        </div>
    );
}

export default PostView;

