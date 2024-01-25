import { Box, Button, ListItem, ListItemButton, ListItemText, MenuItem, Select, SelectChangeEvent, Stack, TextField } from '@mui/material';
import { PostColorsDict, PostData, PostTypes } from '../Global';
import { useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router';
import { fetchForumData } from '../scripts/BackendComm';
import { useSearchParams } from 'react-router-dom';
import { FORUM_PAGE_CHUNK_SIZE } from '../Const';


function renderPost(data: PostData, navigate : NavigateFunction) {
    const { post_id, title, topic, author, date } = data;

    function getKeyByValue(value: string, enumType: { [s: string]: string }): string | undefined {
        return Object.keys(enumType).find(key => enumType[key] === value);
    }
    const typeEnum = getKeyByValue(topic, PostTypes);
    if (typeEnum == undefined){
        return null;
    }
    const typeColor = PostColorsDict[topic as keyof typeof PostColorsDict];
    
    function gotoPost(post_id: string){
        navigate('/post/' + post_id);
    }

    return (
        <ListItem sx={{border: '1px solid blue'}} key={post_id} component="div">
            <ListItemButton onClick={() => gotoPost(post_id.toString())}>
                <Stack direction="row" spacing={2}>
                    <Box sx={{ flexGrow: 1 }} /> {/* Left spacer */}
                    <ListItemText 
                        primary={<><h3>{title}</h3></>} 
                        secondary={
                            <>
                                <span style={{color: typeColor}}><strong>{topic}</strong></span>
                                <span style={{width: '12px', display: 'inline-block'}}></span>
                                Posted by {author}. Date: {date}
                            </>
                        }
                    />
                    <Box sx={{ flexGrow: 1 }} /> {/* Right spacer */}
                </Stack>
            </ListItemButton>
        </ListItem>
    );
}

const chunkSize = FORUM_PAGE_CHUNK_SIZE;

function ForumView() {
    const [searchParams] = useSearchParams();
    const search_title: string = searchParams.get('title') || "";
    const search_topic: string = searchParams.get('topic') || "All";
    
    const [posts, setPosts] = useState<PostData[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPosts, setTotalPosts] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [hasQueried, setHasQueried] = useState<boolean>(false);
    const navigate = useNavigate();

    const [searchValue, setSearchValue] = useState<string>(search_title);
    const [selectedTopic, setSelectedTopic] = useState<PostTypes>(search_topic as PostTypes || PostTypes.all);

    useEffect(() => {
        setCurrentPage(1); // Reset the current page to 1 if the search params change
    }, [search_title, search_topic]);

    useEffect(() => {
        const offset = (currentPage - 1); // do not multiply by chunksize here, that is done in the back end
        fetchForumData(search_title, search_topic, offset, chunkSize).then(reply => {
            setHasQueried(true);
            if (reply.error) {
                console.error(reply.error);
                setPosts([]);
                setTotalPosts(0);
                setTotalPages(0);
                return;
            }
            if (!reply.data.posts) {
                console.error("No posts returned");
                setPosts([]);
                setTotalPosts(0);
                setTotalPages(0);
                return;
            }
            setPosts(reply.data.posts);
            setTotalPosts(reply.data.post_count);
            setTotalPages(Math.ceil(reply.data.post_count / chunkSize));
        });
    }, [search_title, search_topic, currentPage]);

    const handleTopicChange = (event: SelectChangeEvent<PostTypes>) => {
        setSelectedTopic(event.target.value as PostTypes);
    };

    const handleSearch = () => {
        navigate(`/forum?title=${encodeURIComponent(searchValue)}&topic=${encodeURIComponent(selectedTopic)}`);
    };

    const noPostsRender = () =>{
        if (hasQueried) {
            return <div>No posts found</div>
        }
        else{
            return <div>Loading...</div>
        }
    }

    return (
        <div>
            <div>
            <Box display="flex" alignItems="stretch" style={{ height: '100%' }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    sx={{ flex: 1 }} // Take the remaining space
                />
                <Select
                    label="Topic"
                    value={selectedTopic}
                    onChange={handleTopicChange}
                    variant="outlined"
                    sx={{
                        maxWidth: '20%', // Maximum width of 20%
                        minWidth: 'auto', // Minimum width to fit content
                        marginLeft: '4px',
                        marginRight: '4px'
                    }}
                    style={{ 
                        backgroundColor: PostColorsDict[selectedTopic], 
                        color: 'white' 
                    }}
                >
                    {
                        Object.values(PostTypes).map((topic) => (
                            <MenuItem value={topic}
                            style={{ 
                                backgroundColor: PostColorsDict[topic], 
                                color: 'white' 
                            }}
                            key = {topic}
                            >{topic}</MenuItem>
                        ))
                    }
                </Select>
                <Button
                    variant="contained"
                    onClick={handleSearch}
                >
                    Search
                </Button>
            </Box>
        </div>
            <div style={{border: '1px solid red'}}>
                {(!posts || posts.length === 0) ?
                    noPostsRender() :
                    posts.map((postData: PostData) => (
                        renderPost(postData, navigate)
                ))}
            </div>
            <Box display="flex" justifyContent="center" m={2}>
                <Button
                    disabled={totalPages <= 0 || currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Previous
                </Button>
                <strong>{currentPage}</strong>
                <Button 
                    disabled={totalPages <= 0 || currentPage === totalPages || currentPage * chunkSize >= totalPosts} 
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next
                </Button>
            </Box>
        </div>
    );
}

export default ForumView;

