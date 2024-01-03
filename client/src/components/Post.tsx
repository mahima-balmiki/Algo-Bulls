// Post.tsx
import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import SingleComment from "./SingleComment";
import SERVER_URL from "../SERVER_URL";
import {
  Typography,
  Button,
  Input,
  Popconfirm,
  Card,
} from "antd";
import {
  HeartOutlined,
  HeartFilled,
  BookOutlined,
  BookFilled,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export type Comment = [string, string];

export interface PostProps {
  id: string;
  username: string;
  name: string;
  title: string;
  content: string;
  likes: string[];
  bookmarks: string[];
  comments: Comment[];
  date: string;
}



const Post: React.FC<PostProps> = ({
  id,
  username,
  name,
  title,
  content,
  likes,
  bookmarks,
  comments,
  date,
}) => {
  const user = useContext(AuthContext);

  const [newtitle, setNewTitle] = useState(title);
  const [newcontent, setNewContent] = useState(content);
  const [like, setLike] = useState(likes.includes(user?.username || ""));
  const [likeCount, setLikeCount] = useState(likes.length);
  const [bookmark, setBookmark] = useState(bookmarks.includes(user?.username || ""));
  const [bookmarkCount, setBookmarkCount] = useState(bookmarks.length);

  const [commentState, setCommentState] = useState<Comment[]>(comments);
  const [commentInput, setCommentInput] = useState("");

  const [toggleEdit, setToggleEdit] = useState(false);
  const [editPostTitle, setEditPostTitle] = useState(title);
  const [editPostContent, setEditPostContent] = useState(content);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleLike = () => {
    axios
      .post(`${SERVER_URL}/api/likes`, { username: user?.username, _id: id })
      .then((response) => {
        setLike(!like);
        if (like) {
          setLikeCount((prevCount) => prevCount - 1);
        } else {
          setLikeCount((prevCount) => prevCount + 1);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleBookmark = () => {
    axios
      .post(`${SERVER_URL}/api/bookmarks`, { username: user?.username, _id: id })
      .then((response) => {
        setBookmark(!bookmark);
        if (bookmark) {
          setBookmarkCount((prevCount) => prevCount - 1);
        } else {
          setBookmarkCount((prevCount) => prevCount + 1);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleComment = () => {
    axios
      .post(`${SERVER_URL}/api/comment`, {
        _id: id,
        username: user?.username,
        comment: commentInput,
      })
      .then((response) => {
        setCommentState((prevComments) => [
          ...prevComments, [user?.username || "", commentInput] ,
        ]);
        setCommentInput("");
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCommentInput(e.target.value);
  };

  const handleEditTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setEditPostTitle(e.target.value);
  };

  const handleEditContent = (e: ChangeEvent<HTMLInputElement>) => {
    setEditPostContent(e.target.value);
  };

  const handleEditPost = () => {
    axios
      .post(`${SERVER_URL}/api/editpost`, {
        _id: id,
        title: editPostTitle,
        content: editPostContent,
      })
      .then((response) => {
        setNewTitle(editPostTitle);
        setNewContent(editPostContent);
        setToggleEdit(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleDelete = () => {
    axios
      .post(`${SERVER_URL}/api/deletepost`, {
        _id: id,
      })
      .then((response) => {
        setDeleted(true);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  return (
    <Card
      title={newtitle}
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        marginBottom: "16px",
      }}
    >
      {deleted && <Paragraph>This post is deleted.</Paragraph>}
      {<span>Posted on: {date}</span>}
      <Title level={4}>{name}</Title>
      <Title level={5}>@{username}</Title>
      <Paragraph>{newcontent}</Paragraph>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}
      >
        <Button
          type="link"
          onClick={handleLike}
          style={{ marginRight: "4px", verticalAlign: "middle", padding: 0 }}
        >
          {like ? (
            <HeartFilled style={{ fontSize: "16px", color: "#eb2f96" }} />
          ) : (
            <HeartOutlined style={{ fontSize: "16px" }} />
          )}
        </Button>
        <span>{likeCount}</span>
        <Button
          type="link"
          onClick={handleBookmark}
          style={{
            marginLeft: "4px",
            marginRight: "4px",
            verticalAlign: "middle",
            padding: 0,
          }}
        >
          {bookmark ? (
            <BookFilled style={{ fontSize: "16px", color: "#1890ff" }} />
          ) : (
            <BookOutlined style={{ fontSize: "16px" }} />
          )}
        </Button>
        <span>{bookmarkCount}</span>
      </div>
      
      {commentState?.map((comment, index) => (
        <Card
          key={index}
          style={{
            border: "1px solid #ddd",
            borderRadius: "4px",
            marginTop: "4px",
            padding: "4px",
          }}
        >
          <Paragraph style={{ margin: 0 }}>
          
            <SingleComment _id={id} commentList={comment}/>
            
          </Paragraph> 
        </Card>
      ))}
      
      <Input
        type="text"
        name="commentInput"
        value={commentInput}
        onChange={handleInputChange}
        style={{ marginTop: "4px" }}
      />
      <Button
        type="primary"
        onClick={handleComment}
        style={{ marginTop: "4px" }}
      >
        Comment
      </Button>

      {/* Edit Button and Delete button */}
      {user?.username === username && (
        <div style={{ marginTop: "8px" }}>
          {!toggleEdit && (
            <Button
              type="primary"
              onClick={() => setToggleEdit(true)}
              size="small"
            >
              <EditOutlined style={{ fontSize: "16px", marginRight: "4px" }} />{" "}
              Edit Post
            </Button>
          )}
          {toggleEdit && (
            <div>
              <Title level={4}>Edit Post</Title>
              <Input
                type="text"
                name="editPostTitle"
                value={editPostTitle}
                onChange={handleEditTitle}
                style={{ marginBottom: "4px" }}
              />
              <Input
                type="text"
                name="editPostContent"
                value={editPostContent}
                onChange={handleEditContent}
                style={{ marginBottom: "4px" }}
              />
              <Button
                type="primary"
                onClick={handleEditPost}
                style={{ marginRight: "4px" }}
              >
                Save Edited Changes
              </Button>
              <Button onClick={() => setToggleEdit(false)}>
                Cancel Changes
              </Button>
            </div>
          )}
          {toggleDelete ? (
            <div style={{ marginTop: "4px" }}>
              <Popconfirm
                title="Do you want to delete this Post?"
                onConfirm={handleDelete}
                onCancel={() => setToggleDelete(false)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" danger size="small">
                  <DeleteOutlined
                    style={{ fontSize: "16px", marginRight: "4px" }}
                  />{" "}
                  Delete Post
                </Button>
              </Popconfirm>
            </div>
          ) : (
            <Button
              type="primary"
              danger
              onClick={() => setToggleDelete(true)}
              style={{ marginTop: "4px" }}
              size="small"
            >
              <DeleteOutlined
                style={{ fontSize: "16px", marginRight: "4px" }}
              />{" "}
              Delete Post
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default Post;
