import React, { useState, useEffect } from "react";
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
  likes: string[]; // Assuming each element is a user ID
  bookmarks: string[]; // Assuming each element is a user ID
  comments: Comment[];
  date: string;
}

const AllPosts: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    // Fetch data from the Express server
    axios
      .get<PostData[]>(`${SERVER_URL}/api/allposts`)
      .then((response) => {
        setPosts(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

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

export default AllPosts;
