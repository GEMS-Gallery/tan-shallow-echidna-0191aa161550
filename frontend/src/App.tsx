import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, CardMedia, CardActions, IconButton, TextField, Button, CircularProgress } from '@mui/material';
import { ThumbUp, Comment, Send } from '@mui/icons-material';
import { backend } from 'declarations/backend';

interface Post {
  id: bigint;
  content: string;
  image: string | null;
  category: string | null;
  likes: bigint;
  comments: Comment[];
  createdAt: bigint;
}

interface Comment {
  content: string;
  createdAt: bigint;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (newPostContent.trim() === '') return;
    setLoading(true);
    try {
      const result = await backend.createPost(newPostContent, null, null);
      if ('ok' in result) {
        setNewPostContent('');
        fetchPosts();
      } else {
        console.error('Error creating post:', result.err);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setLoading(false);
  };

  const handleLikePost = async (postId: bigint) => {
    try {
      const result = await backend.likePost(postId);
      if ('ok' in result) {
        fetchPosts();
      } else {
        console.error('Error liking post:', result.err);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async (postId: bigint, comment: string) => {
    if (comment.trim() === '') return;
    try {
      const result = await backend.addComment(postId, comment);
      if ('ok' in result) {
        fetchPosts();
      } else {
        console.error('Error adding comment:', result.err);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Pixel</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" className="mt-8">
        <Card className="mb-8">
          <CardContent>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreatePost}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Post'}
            </Button>
          </CardActions>
        </Card>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={4}>
            {posts.map((post) => (
              <Grid item xs={12} key={post.id.toString()}>
                <Card>
                  {post.image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={post.image}
                      alt="Post image"
                    />
                  )}
                  <CardContent>
                    <Typography variant="body1">{post.content}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(Number(post.createdAt) / 1000000).toLocaleString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => handleLikePost(post.id)}>
                      <ThumbUp />
                    </IconButton>
                    <Typography>{post.likes.toString()} likes</Typography>
                    <IconButton>
                      <Comment />
                    </IconButton>
                    <Typography>{post.comments.length} comments</Typography>
                  </CardActions>
                  <CardContent>
                    {post.comments.map((comment, index) => (
                      <Typography key={index} variant="body2">
                        {comment.content}
                      </Typography>
                    ))}
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Add a comment"
                      size="small"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(post.id, (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default App;
