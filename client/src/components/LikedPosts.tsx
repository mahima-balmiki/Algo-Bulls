import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import SERVER_URL from "../SERVER_URL";
import axios from "axios";
import Post from "./Post";

type Comment = [string, string];

interface PostData {
  _id: string;
  title: string;
  username: string;
  name: string;
  content: string;
  likes: string[];
  bookmarks: string[];
  comments: Comment[];
  date: string;
}

const LikedPosts: React.FC = () => {
  const user = useContext(AuthContext);
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    if (user && user.username) {
      // Fetch data from the Express server
      axios
        .post<PostData[]>(`${SERVER_URL}/api/likedposts`, {
          username: user.username,
        })
        .then((response) => {
          setPosts(response.data);
          console.log(response.data);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [user]);

  if (!user || !user.username) {
    // Handle the case when user or username is undefined
    return <div>Error: User information not available.</div>;
  }

  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post._id}
          id={post._id}
          title={post.title}
          username={post.username}
          name={post.name}
          content={post.content}
          likes={post.likes}
          bookmarks={post.bookmarks}
          comments={post.comments}
          date={post.date}
        />
      ))}
    </div>
  );
};

export default LikedPosts;
