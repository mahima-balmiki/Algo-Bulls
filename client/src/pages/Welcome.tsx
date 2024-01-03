import React, { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button, Row, Col } from "antd";
import Home from "./Home";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const Welcome: React.FC = () => {
  const user = useContext(AuthContext);

  const [toggleSignIn, setToggleSignIn] = useState(true);
  const handleToggle = () => {
    setToggleSignIn(!toggleSignIn);
  };

  if (user && user.isLoggedIn) {
    return <Home />;
  } else {
    return (
      // <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      //   <Col span={8} style={{ textAlign: "center" }}>
      <Row justify={"center"} >
        <Col style={{marginTop:"100px"}}>
          {toggleSignIn ? <SignIn /> : <SignUp />}
          <Button
            type="link"
            onClick={handleToggle}
            style={{ marginTop: "16px" }}
          >
            {toggleSignIn
              ? "Create a New Account - Sign Up"
              : "Already have an Account? - Sign In"}
          </Button>
        </Col>
      </Row>
    );
  }
};

export default Welcome;
