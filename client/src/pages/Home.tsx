// Home.tsx
import "../styles/Home.css";
import React, { useContext, useState } from "react";
import { Layout, Menu, Typography } from "antd";
import {
  FormOutlined,
  UnorderedListOutlined,
  HeartOutlined,
  BookOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Logout from "../components/Logout";
import Profile from "../components/Profile";
import CreatePost from "../components/CreatePost";
import AllPosts from "../components/AllPosts";
import LikedPosts from "../components/LikedPosts";
import BookmarkedPosts from "../components/BookmarkedPosts";
import MyPosts from "../components/MyPosts";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const Home: React.FC = () => {
  const user = useContext(AuthContext) || { isLoggedIn: false, name: "" };
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState("CreatePost");

  const changeTab = (tab: string) => {
    setActiveTab(tab);
  };

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} width={200} collapsedWidth={60} className="sider"> */}
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} collapsedWidth={40} className="sider">
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} style={{position:"fixed", top:0, width:collapsed ? 40 : 200}}>
          <Menu.Item
            key="/home/create-post"
            onClick={() => changeTab("CreatePost")}
            icon={<FormOutlined />}
          >
            <Link to="/home/create-post">Create Post</Link>
          </Menu.Item>
          <Menu.Item
            key="/home/all-posts"
            onClick={() => changeTab("AllPosts")}
            icon={<UnorderedListOutlined />}
          >
            <Link to="/home/all-posts">All Posts</Link>
          </Menu.Item>
          <Menu.Item
            key="/home/liked-posts"
            onClick={() => changeTab("LikedPosts")}
            icon={<HeartOutlined />}
          >
            <Link to="/home/liked-posts">Liked Posts</Link>
          </Menu.Item>
          <Menu.Item
            key="/home/bookmarked-posts"
            onClick={() => changeTab("BookmarkedPosts")}
            icon={<BookOutlined />}
          >
            <Link to="/home/bookmarked-posts">Bookmarked Posts</Link>
          </Menu.Item>
          <Menu.Item
            key="/home/my-posts"
            onClick={() => changeTab("MyPosts")}
            icon={<FileTextOutlined />}
          >
            <Link to="/home/my-posts">My Posts</Link>
          </Menu.Item>
          <Menu.Item
            key="/home/my-profile"
            onClick={() => changeTab("Profile")}
            icon={<UserOutlined />}
          >
            <Link to="/home/my-profile">My Profile</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            background: "#fff",
            position: "sticky",
            top: 0,
            zIndex: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Title level={3} style={{ margin: 0, paddingLeft: "16px" }} className="titles">
            Social Media App
          </Title>
          <span
            style={{
              marginLeft: "auto",
              marginRight: "16px",
              display: "flex",
              alignItems: "center",
            }}
          >
            Welcome {user.isLoggedIn && user.name}{" "}
            <span style={{ marginRight: "8px" }} />
            <Logout />
          </span>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            // padding: 24,
            minHeight: 280,
            overflow: "initial",
          }}
        >
          {activeTab === "CreatePost" && <CreatePost />}
          {activeTab === "AllPosts" && <AllPosts />}
          {activeTab === "LikedPosts" && <LikedPosts />}
          {activeTab === "BookmarkedPosts" && <BookmarkedPosts />}
          {activeTab === "MyPosts" && <MyPosts />}
          {activeTab === "Profile" && <Profile />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
