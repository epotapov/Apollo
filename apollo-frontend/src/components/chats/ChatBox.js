import { Box } from "@chakra-ui/layout";
import { Layout } from "antd";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../../context/ChatContext";

const { Content } = Layout;

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    // <Layout style={{ padding: "10px" }}>
    //   <Content
    //     style={{
    //       display: selectedChat ? "flex" : "none",
    //       alignItems: "center",
    //       flexDirection: "column",
    //       backgroundColor: "white",
    //       width: { base: "100%", md: "68%" },
    //       borderRadius: "lg",
    //       borderWidth: "1px",
    //       marginLeft: { base: 0, md: "10px" },
    //     }}
    //   >
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
