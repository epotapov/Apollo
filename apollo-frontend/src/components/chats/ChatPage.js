import { useState } from "react";
import { Layout } from "antd";
import Chatbox from "./ChatBox";
import MyChats from "./MyChats";
import SideDrawer from "./SideDrawer";
import { ChatState } from "../../context/ChatContext";

const { Content } = Layout;

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <Layout style={{ minHeight: "100vh" }}>
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
