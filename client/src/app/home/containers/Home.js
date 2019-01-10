import React, { Component } from "react";
import Nav from "../../nav/containers/Nav";
import Chat from "../../chat/containers/Chat";
import HomeLayout from "../components/home-layout";

class Home extends Component {
  render() {
    return (
      <HomeLayout>
        <Nav />
        <Chat />
      </HomeLayout>
    );
  }
}

export default Home;
