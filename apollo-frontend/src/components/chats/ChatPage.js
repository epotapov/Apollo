import { useState } from "react";
import { Layout } from "antd";
import Chatbox from "./ChatBox";
import MyChats from "./MyChats";
import SideDrawer from "./SideDrawer";
import { ChatState } from "../../context/ChatContext";
import Navbar from "../Navbar";

const { Content } = Layout;

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (

    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <div className='namePage'>
        <h2> Apollo Chat </h2>
      </div>
      {!user &&
        <div className='namePage'>
          <h2>Sign in to chat!</h2>
        </div>
      }
      {user && <SideDrawer />}
      <Content style={{ padding: "10px" }}>
        <div className="site-layout-content" style={{ display: "flex", justifyContent: "space-between" }}>
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && (
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default Chatpage;
