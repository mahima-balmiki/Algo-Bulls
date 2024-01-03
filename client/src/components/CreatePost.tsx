import React from "react";
import { Form, Input, Button, Typography } from "antd";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import SERVER_URL from "../SERVER_URL";

const { Title } = Typography;

const CreatePost: React.FC = () => {
  const user = useContext(AuthContext);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      if (!user || !user.username || !user.name) {
        throw new Error("User information not available.");
      }

      const values = await form.validateFields();

      // Create FormData object
      const formData = new FormData();
      formData.append("username", user.username);
      formData.append("name", user.name);
      formData.append("title", values.title);
      formData.append("content", values.content);

      // Storing the response
      const response = await axios.post(
        `${SERVER_URL}/api/createpost`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      form.resetFields();
    } catch (error) {
      console.error("Error Creating Post", error);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "auto",
        padding: "20px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
      }}
    >
      <Title level={2} style={{ marginBottom: "20px" }}>
        Create Post
      </Title>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter the title!" }]}
        >
          <Input style={{ borderRadius: "4px" }} />
        </Form.Item>
        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please enter the content!" }]}
        >
          <Input.TextArea rows={4} style={{ borderRadius: "4px" }} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Create Post
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreatePost;
