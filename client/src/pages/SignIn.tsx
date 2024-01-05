import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Form, Input, Button, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import SERVER_URL from "../SERVER_URL"; // e.g. http://localhost:3001

interface SignInValues {
  usernameOrEmail: string;
  password: string;
}

const SignIn: React.FC = () => {
  const user = useContext(AuthContext);

  const [form] = Form.useForm();

  const handleSignIn = async (values: SignInValues) => {
    try {
      // Storing the response
      const response = await axios.post(`${SERVER_URL}/api/signin`, values);

      // Storing the User Data in AuthContext, only if user is defined
      if (user) {
        user.login(response.data);
      }
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Please provide the correct username or email and password.");
    }
  };

  // Render content only if user is defined
  if (!user) {
    return null; // or loading indicator, redirect, or any other logic
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card title="Sign In">
        <Form form={form} name="signInForm" onFinish={handleSignIn}>
          <Form.Item
            name="usernameOrEmail"
            rules={[
              {
                required: true,
                message: "Please enter your username or email!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username or Email" data-testid="usernameOrEmail"/>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" data-testid="password"/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" data-testid="signInSubmit" block>
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SignIn;
