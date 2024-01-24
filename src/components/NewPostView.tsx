import React, { useState } from 'react';
import {
  Container,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Grid,
  SelectChangeEvent
} from '@mui/material';
import { PostColorsDict, PostTypes } from '../Global';
import { newPost } from '../scripts/BackendComm';
import { useNavigate } from 'react-router-dom';


interface NewPostProps {
  // Additional props if needed
}

const NewPostView: React.FC<NewPostProps> = () => {
  const [title, setTitle] = useState<string>('');
  const [topic, setTopic] = useState<PostTypes>(PostTypes.general);
  const [content, setContent] = useState<string>('');
  const navigate = useNavigate();
  const isPublishButtonDisabled = !title || !content;

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleTopicChange = (event: SelectChangeEvent<PostTypes>) => {
    setTopic(event.target.value as PostTypes);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handlePublish = () => {
    newPost(title, topic, content).then(
      (result) => {
        if (result?.success) {
          const post_id = result.data
          window.alert("New post created!")
          navigate('/post/' + post_id);
        }
        else{
          const msg = result.error ?? "Unknown error"
          window.alert(msg)
        }
      })
  };

  const postTypesExceptAll = Object.values(PostTypes).filter((type) => type !== PostTypes.all);

  return (
    <Container maxWidth="sm">
      <h1>Create a New Forum Post</h1>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={title}
            onChange={handleTitleChange}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Topic</InputLabel>
            <Select
              value={topic}
              onChange={handleTopicChange}
              label="Topic"
              style={{ backgroundColor: PostColorsDict[topic], color: 'white' }}
            >
              {Object.values(postTypesExceptAll).map((type) => (
                <MenuItem
                  key={type}
                  value={type}
                  style={{ backgroundColor: PostColorsDict[type], color: 'white' }}
                >
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <TextField
        fullWidth
        label="Content"
        multiline
        rows={6}
        variant="outlined"
        value={content}
        onChange={handleContentChange}
        style={{ marginTop: '16px' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handlePublish}
        style={{ marginTop: '16px' }}
        disabled={isPublishButtonDisabled}
      >
        Publish
      </Button>
    </Container>
  );
};

export default NewPostView;
