import React from "react";
import { Form, Input, Button, Upload } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import SERVER_URL from "../SERVER_URL";

interface SignUpValues {
  username: string;
  email: string;
  name: string;
  profilephoto?: File[];
  password: string;
}

const SignUp: React.FC = () => {
  const user = useContext(AuthContext);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values: SignUpValues = await form.validateFields();

      // Create FormData object
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("name", values.name);
      formData.append("password", values.password);

      // Append the image file if it exists
      if (values.profilephoto && values.profilephoto.length > 0) {
        formData.append("profilephoto", values.profilephoto[0]);
      }

      // Storing the response
      const response = await axios.post(`${SERVER_URL}/api/signup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Check if user is defined before calling login
      if (user) {
        user.login(response.data);
      } else {
        console.error("User context is not defined.");
        // Handle this case as needed, e.g., show an error message or redirect
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert(
        "User with this Username or Email already exists.\nTry a new Username or Email."
      );
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <div>
      <h2>SignUp</h2>
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{ remember: true }}
        encType="multipart/form-data"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email address!" },
          ]}
        >
          <Input prefix={<MailOutlined />} type="email" placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Name" />
        </Form.Item>

        <Form.Item
          name="profilephoto"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            name="profilephoto"
            accept="image/*"
            beforeUpload={() => false}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Upload Profile Photo</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignUp;
