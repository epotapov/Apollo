import React, { useState, useEffect } from "react";
import { Avatar, Button, Drawer, message, Badge, Collapse} from "antd";
import { useLogout } from '../hooks/useLogout';
import { useUserContext } from '../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';
import defpfp from '../img/defaultpfp.png';
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const AvatarBar = (props) => {
    const [visible, setVisible] = useState(false);
    const {user: outerUser} = useUserContext();
    const [user, setUser] = useState(outerUser ? outerUser.user : null);    
    const { logout } = useLogout();
    let pfp = props.pic;
    const navigate = useNavigate();

    const [friendsList, setFriendsList] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);

    const formatFriendList = (friends) => {
        console.log(friends);
        let friendList = [];
        for (let i = 0; i < friends.length; i++) {
            friendList.push({
                username: friends[i].username,
                profilePicture: friends[i].profilePicture
            });
        }
        setFriendsList(friendList);
    }

    const formatFriendRequests = (friendRequests) => {
        let friendRequestList = [];
        for (let i = 0; i < friendRequests.length; i++) {
            console.log(friendRequests[i]);
            friendRequestList.push(friendRequests[i]);
        }
        setFriendRequests(friendRequestList);
    }

    useEffect(() => {
        if (user) {
            if (pfp === 'default' || pfp === "" || pfp === null) {
                pfp = defpfp;
            }
            else {
                pfp = props.pic;
            }
            formatFriendList(user.friendsList ? user.friendsList : []);
            if (user.friendRequests.length != friendRequests.length) {
                console.log("friend requests changed");
                formatFriendRequests(user.friendRequests ? user.friendRequests : []);
            }
        }
    }, [user]);

    const recentActivity = [
        {
            path: "/",
            title: "You comment on a thread in CS180!",
            time: "1 hour ago"
        },
        {
            path: "/",
            title: "You comment on a thread in CS180!",
            time: "1 hour ago"
        },
        {
            path: "/",
            title: "You comment on a thread in CS180!",
            time: "1 hour ago"
        },
    ]

    const showDrawer = () => {
        setVisible(true);
    }

    const onClose = () => {
        setVisible(false);
    }

    const handleLogout = () => {
        logout();
        message.success("Logged out successfully");
    }

    const acceptFriendRequest = (friendUsername) => {
        const response = fetch('http://localhost:5001/api/user/acceptFriendRequest', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: user.username,
            friendUsername: friendUsername
          })
        })
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                setUser(data.user);
                formatFriendList(user.friendsList);
                formatFriendRequests(user.friendRequests);
                message.success("Friend request accepted", 2);
            }
        })
    }

    const denyFriendRequest = (friendUsername) => {
        const response = fetch('http://localhost:5001/api/user/denyFriendRequest', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: user.username,
                friendUsername: friendUsername
            })
        })
    }

    return (
        <div className="avatar-bar">
            <Badge count={3}>
                <Avatar 
                    className="avatar"
                    size={35}
                    src={pfp}
                    onClick={showDrawer}
                    shape="circle"
                    style={{ cursor: "pointer", marginRight: "10px"}}
                />
            </Badge>
            <Drawer
                title="Profile Menu and Settings"
                placement="right"
                closable={true}
                onClose={onClose}
                open={visible}
            >
                <Collapse>
                    <Panel header={"Friend Requests (" + friendRequests.length + ")"} key="1" >
                        {friendRequests.map((friend) => (
                            <div key={friend}>
                                <a target="_blank" href={`/Profile/${friend}`}> {friend}: </a>
                                <CheckCircleOutlined onClick={() => acceptFriendRequest(friend)}>Accept</CheckCircleOutlined>
                                <CloseCircleOutlined onClick={() => denyFriendRequest(friend)}>Decline</CloseCircleOutlined>
                            </div>
                        ))}
                    </Panel>
                    <Panel header="Friends" key="2">
                        {friendsList.map((friend) => (
                            <div key={friend.username}>
                                <Avatar 
                                    src={friend.profilePicture !== "default" ? `http://localhost:5001/pictures/${friend.profilePicture}` : defpfp } 
                                    onClick={() => {window.open(`/Profile/${friend.username}`);}}
                                />
                                <a target="_blank" href={`/Profile/${friend.username}`}> {friend.username} </a>
                            </div>
                        ))}
                    </Panel>
                    <Panel header="Recent Activity" key="3">
                        {recentActivity.map((activity) => (
                            <div>
                                <a target="_blank" href={activity.path}> {activity.title}: </a> - {activity.time}
                                key={activity.title}
                            </div>
                        ))}
                    </Panel>
                </Collapse>
                <Button onClick={() => {navigate(`/Profile/${user.username}`);}}>View Profile</Button>
                <Button onClick={handleLogout}>Logout</Button>
            </Drawer>
        </div>
    )
}

export default AvatarBar;