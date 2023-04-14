import { Layout } from "antd";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../../context/ChatContext";

const { Content } = Layout;

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Layout style={{ padding: "10px" }}>
      <Content
        style={{
          display: selectedChat ? "flex" : "none",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: "white",
          width: { base: "100%", md: "68%" },
          borderRadius: "lg",
          borderWidth: "1px",
          marginLeft: { base: 0, md: "10px" },
        }}
      >
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Content>
    </Layout>
  );
};

export default Chatbox;
