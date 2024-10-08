import Bool "mo:base/Bool";

import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Int "mo:base/Int";
import Option "mo:base/Option";

actor {
  // Types
  type Post = {
    id: Nat;
    content: Text;
    image: ?Text;
    category: Text;
    likes: Nat;
    comments: [Comment];
    createdAt: Int;
    username: Text;
    avatar: Text;
  };

  type Comment = {
    content: Text;
    createdAt: Int;
    username: Text;
  };

  // Stable variables
  stable var posts : [Post] = [];
  stable var nextPostId : Nat = 0;

  // Helper functions
  func findPost(id: Nat) : ?Post {
    Array.find(posts, func (p: Post) : Bool { p.id == id })
  };

  // API methods
  public query func getPosts(category: ?Text) : async [Post] {
    switch (category) {
      case (null) { posts };
      case (?cat) { Array.filter(posts, func (p: Post) : Bool { p.category == cat }) };
    }
  };

  public func createPost(content: Text, image: ?Text, category: Text, username: Text, avatar: Text) : async Result.Result<Nat, Text> {
    let post : Post = {
      id = nextPostId;
      content;
      image;
      category;
      likes = 0;
      comments = [];
      createdAt = Time.now();
      username;
      avatar;
    };
    posts := Array.append(posts, [post]);
    nextPostId += 1;
    #ok(post.id)
  };

  public func likePost(postId: Nat) : async Result.Result<(), Text> {
    let updatedPosts = Array.map(posts, func (p: Post) : Post {
      if (p.id == postId) {
        {
          id = p.id;
          content = p.content;
          image = p.image;
          category = p.category;
          likes = p.likes + 1;
          comments = p.comments;
          createdAt = p.createdAt;
          username = p.username;
          avatar = p.avatar;
        }
      } else {
        p
      }
    });
    
    switch (Array.find(updatedPosts, func (p: Post) : Bool { p.id == postId })) {
      case null { #err("Post not found") };
      case (?_) {
        posts := updatedPosts;
        #ok()
      };
    }
  };

  public func addComment(postId: Nat, content: Text, username: Text) : async Result.Result<(), Text> {
    let comment : Comment = {
      content;
      createdAt = Time.now();
      username;
    };
    
    let updatedPosts = Array.map(posts, func (p: Post) : Post {
      if (p.id == postId) {
        {
          id = p.id;
          content = p.content;
          image = p.image;
          category = p.category;
          likes = p.likes;
          comments = Array.append(p.comments, [comment]);
          createdAt = p.createdAt;
          username = p.username;
          avatar = p.avatar;
        }
      } else {
        p
      }
    });
    
    switch (Array.find(updatedPosts, func (p: Post) : Bool { p.id == postId })) {
      case null { #err("Post not found") };
      case (?_) {
        posts := updatedPosts;
        #ok()
      };
    }
  };
}
