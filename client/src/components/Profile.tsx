import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Upload,
  message,
  Image,
  Typography,
  Layout,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";
import bufferToImage from "../bufferToImage";
import axios from "axios";
import SERVER_URL from "../SERVER_URL";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const { Content } = Layout;
const { Title } = Typography;

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = () => {
  const user = useContext(AuthContext);

  const [form] = Form.useForm();

  const [updateProfile, setUpdateProfile] = useState(false);

  const onFinish = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("username", user?.username || "");
      formData.append("name", values.name);
      formData.append("password", values.password);

      if (values.profilephoto && values.profilephoto.length > 0) {
        formData.append("profilephoto", values.profilephoto[0].originFileObj);
      }

      const response = await axios.post(
        `${SERVER_URL}/api/updateprofile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      user?.login(response.data);
      setUpdateProfile(false);
      message.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Error updating profile. Please try again.");
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Content
        style={{
          width: "100%",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title level={2}>Your Profile</Title>

        {!updateProfile && (
          <>
            {/* Display existing details */}
            {user?.profilephoto ? (
              <Image
                src={bufferToImage(user?.profilephoto)}
                alt={user?.name || ""}
                style={{
                  height: "100px",
                  width: "100px",
                  borderRadius: "50%",
                  marginBottom: "16px",
                }}
              />
            ) : (
              <UserOutlined style={{ fontSize: "100px", color: "blue" }} />
            )}

            <p>Username: @{user?.username}</p>
            <p>Email: {user?.email}</p>
            <p>Name: {user?.name}</p>
            <p>Password: ********</p>
          </>
        )}

        <Form
          form={form}
          name="updateProfileForm"
          onFinish={onFinish}
          initialValues={{
            name: user?.name,
          }}
        >
          <Form.Item
            name="profilephoto"
            label="Profile Photo"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload beforeUpload={() => false} listType="picture" maxCount={1}>
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Update Profile
            </Button>
          </Form.Item>
        </Form>

        {updateProfile && (
          <Button
            style={{ width: "100%", marginTop: "16px" }}
            onClick={() => setUpdateProfile(false)}
          >
            Cancel
          </Button>
        )}
      </Content>
    </Layout>
  );
};

export default Profile;
