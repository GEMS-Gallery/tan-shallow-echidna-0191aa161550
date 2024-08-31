import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';

interface Post {
  id: bigint;
  content: string;
  image: string | null;
  category: string;
  likes: bigint;
  comments: Comment[];
  createdAt: bigint;
  username: string;
  avatar: string;
}

interface Comment {
  content: string;
  createdAt: bigint;
  username: string;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts(selectedCategory);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
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
      const result = await backend.addComment(postId, comment, 'Anonymous'); // Replace 'Anonymous' with actual username when implemented
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
    <div>
      <header className="header">
        <div className="logo">
          <div className="logo-icon"></div>
          Pixel
        </div>
      </header>
      <div className="container">
        <nav className="left-menu">
          <div className="menu-item" onClick={() => setSelectedCategory(null)}>
            <svg className="menu-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 3h18v18H3V3zm2 2v14h14V5H5z" fill="none" stroke="#000" strokeWidth="2"/></svg>
            All
          </div>
          <div className="menu-item" onClick={() => setSelectedCategory('Travel')}>
            <svg className="menu-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 3H3v18h18V3zm-2 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" fill="none" stroke="#000" strokeWidth="2"/></svg>
            Travel
          </div>
          <div className="menu-item" onClick={() => setSelectedCategory('People')}>
            <svg className="menu-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="none" stroke="#000" strokeWidth="2"/></svg>
            People
          </div>
          <div className="menu-item" onClick={() => setSelectedCategory('Food')}>
            <svg className="menu-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" fill="none" stroke="#000" strokeWidth="2"/></svg>
            Food
          </div>
          <div className="menu-item" onClick={() => setSelectedCategory('Sports')}>
            <svg className="menu-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 1A4.5 4.5 0 0010 5.5V9H3v6h1.5v7h15v-7H21V9h-3V5.5A4.5 4.5 0 0014.5 1zm0 2c1.4 0 2.5 1.1 2.5 2.5V9h-5V5.5C12 4.1 13.1 3 14.5 3z" fill="none" stroke="#000" strokeWidth="2"/></svg>
            Sports
          </div>
        </nav>
        <div className="feed">
          {posts.map((post) => (
            <div className="post" key={post.id.toString()}>
              <div className="post-header">
                <img src={post.avatar} alt="User Avatar" />
                <span className="username">{post.username}</span>
                <span className="category-tag">{post.category}</span>
              </div>
              {post.image && (
                <div className="post-image">
                  <img src={post.image} alt="Post Image" />
                </div>
              )}
              <div className="post-actions">
                <button className="action-btn like-btn" onClick={() => handleLikePost(post.id)}>
                  <svg className="action-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="#000" strokeWidth="2"/></svg>
                </button>
                <button className="action-btn">
                  <svg className="action-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" fill="none" stroke="#000" strokeWidth="2"/></svg>
                </button>
                <span className="post-likes">{post.likes.toString()} likes</span>
              </div>
              <div className="post-caption">
                <strong>{post.username}</strong> {post.content}
              </div>
              <div className="comments">
                {post.comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <strong>{comment.username}</strong> {comment.content}
                  </div>
                ))}
              </div>
              <form className="comment-form" onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.elements.namedItem('comment') as HTMLInputElement;
                handleAddComment(post.id, input.value);
                input.value = '';
              }}>
                <input type="text" name="comment" className="comment-input" placeholder="Add a comment..." />
                <button type="submit" className="comment-submit">Post</button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
