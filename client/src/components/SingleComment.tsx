import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import SERVER_URL from "../SERVER_URL";
import {
  
  Button,
  Input,
  Popconfirm,
  
} from "antd";


type singleCommentProps = {
  _id: string;
  commentList: [string, string];
};

const SingleComment: React.FC<singleCommentProps> = ({_id, commentList }) => {
  const user = useContext(AuthContext)
  const [toggleCommentEdit, setToggleCommentEdit] = useState(false);
  const [newComment, setNewComment] = useState(commentList);
  const [editedComment, setEditedComment] = useState(commentList);
  const [deletedComment, setDeletedComment] = useState(false);

  const handleNewComment = (e: ChangeEvent<HTMLInputElement>) => {
    setNewComment([user?.username || "", e.target.value]);
  }

  const handleCommentEdit = () =>{

    axios
      .post(`${SERVER_URL}/api/updatecomment`, {_id: _id, oldComment:commentList, newComment:newComment })
      .then((response) => {
        setEditedComment([newComment[0] || "", newComment[1]]);
        setToggleCommentEdit(false)
      })
      .catch((error) => console.error("Error updating comment:", error));
  }

  const handleCommentDelete = () =>{
    axios
      .post(`${SERVER_URL}/api/deletecomment`, {_id: _id, commentToDelete:editedComment })
      .then((response) => {
        setDeletedComment(true)
      })
      .catch((error) => console.error("Error deleting comment:", error));
  }
  
  return (
    <div>
      {deletedComment && <div style={{color:"red"}}> This Comment is Deleted.</div>}
      <strong>{editedComment[0]}:</strong><span>{editedComment[1]}</span><br/>

      {toggleCommentEdit && (
        <div>
          Edit Comment : <Input
                          type="text"
                          name="commentEdit"
                          value={newComment[1]}
                          onChange={handleNewComment}
                          style={{ marginBottom: "4px" }}
                        />
          <Button type="primary" onClick={handleCommentEdit}>Edit Comment</Button>
          <Button onClick={()=>{setToggleCommentEdit(false)}}>Cancel</Button>
        </div>)}

      {!toggleCommentEdit && user?.username === commentList[0] && (
      <Button type="primary" onClick={()=>{setToggleCommentEdit(true)}}>Edit Comment</Button>)}

      {user?.username === commentList[0] && (
        <Popconfirm
                title="Do you want to delete this Comment?"
                onConfirm={handleCommentDelete}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
              >
      <Button type="primary" danger>Delete Comment</Button>
      </Popconfirm>
      )}
    </div>
  );
};

export default SingleComment;
