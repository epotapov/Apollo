import React, { useState, useEffect } from "react";
import { Avatar, Button, Drawer, message, Badge, Collapse} from "antd";
import { useLogout } from '../hooks/useLogout';
import { useUserContext } from '../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';
import defpfp from '../img/defaultpfp.png';
import { CheckCircleOutlined, CloseCircleOutlined, LinkOutlined  } from "@ant-design/icons";

const { Panel } = Collapse;

const AvatarBar = (props) => {
    const [visible, setVisible] = useState(false);
    const {user: outerUser} = useUserContext();
    const [user, setUser] = useState(outerUser ? outerUser.user : null);    
    const { logout } = useLogout();
    const [recentActivity, setRecentActivity] = useState([]);
    let pfp = props.pic;
    const navigate = useNavigate();

    const [friendsList, setFriendsList] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
        if (user) {
            if (pfp === 'default' || pfp === "" || pfp === null) {
                pfp = defpfp;
            }
            else {
                pfp = props.pic;
            }
            formatFriendList(user.friendsList ? user.friendsList : []);
            if (user.friendRequests && user.friendRequests.length != friendRequests.length) {
                formatFriendRequests(user.friendRequests ? user.friendRequests : []);
            }
            formatRecentActivity(user.recentActivity ? user.recentActivity : []);
        }
    }, [user]);
    useEffect(() => {
        if (outerUser) {
            const fetchUpdatedUser = async () => {
                await fetch('http://localhost:5001/api/user/get/' + user.username)
                .then(response => response.json())
                .then(data => setUser(data))
                .catch(error => {
                message.error('Connection Error');
                }); 
            }
            fetchUpdatedUser();
        }
    }, [outerUser]);

    const formatRecentActivity = (recentActivity) => {
        let recentActivityList = [];
        for (let i = 0; i < recentActivity.length; i++) {
            // recentActivity[i] is in format "title:type:path"
            recentActivityList.push({
                title: recentActivity[i].split(":")[0],
                type: recentActivity[i].split(":")[1],
                path: recentActivity[i].split(":")[2]
            });
        }
        setRecentActivity(recentActivityList);
    }

    const formatFriendList = (friends) => {
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
            if (user.friendRequests && user.friendRequests.length != friendRequests.length) {
                console.log("friend requests changed");
                formatFriendRequests(user.friendRequests ? user.friendRequests : []);
            }
        }
    }, [user]);


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

    const handleClearRecentActivity = async () => {
        const response = await fetch(`http://localhost:5001/api/user/clear-recent-activity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: user.username
            })
        })
        .then(response => response.json())

        if (response.message == "Recent activity cleared!") {
            message.success("Recent activity cleared", 2);
            formatRecentActivity([]);
        }
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
        .catch(error => {
            message.error('Connection Error');
        });
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
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                setUser(data.user);
                formatFriendList(user.friendsList);
                formatFriendRequests(user.friendRequests);
                message.success("Friend request denied", 2);
            }
        })
        .catch(error => {
            message.error('Connection Error');
        });
    }

    const activityPath = (activity) => {
        const type = activity.type;
        const path = activity.path;
        // Path will be `/Profile/${username}` where username is stored in path after semi-colon
        let fullPath = "/";
        if (type === "Profile") {
            fullPath = `/Profile/${path}`;
        } else if (type === "Course") {
            fullPath = `/Course/${path}`;
        } else if (type === "Group") {
            fullPath = `/Group/${path}`;
        } else {
            fullPath = "/";
        }

        return fullPath;
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
                <Collapse defaultActiveKey={0}>
                    <Panel header={"Friend Requests (" + friendRequests.length + ")"} key="1" collapsible={friendRequests.length > 0}>
                        {friendRequests.map((friend) => (
                            <div key={friend}>
                                <a target="_blank" href={`/Profile/${friend}`}> {friend}: </a>
                                <CheckCircleOutlined onClick={() => acceptFriendRequest(friend)}>Accept</CheckCircleOutlined>
                                <CloseCircleOutlined onClick={() => denyFriendRequest(friend)}>Decline</CloseCircleOutlined>
                            </div>
                        ))}
                    </Panel>
                    <Panel header="Friends" key="2" collapsible={friendsList.length > 0}>
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
                    <Panel header="Recent Activity" key="3" collapsible={recentActivity.length > 0}>
                        {recentActivity.map((activity) => (
                            <div key={activity.title} 
                                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #d9d9d9'}}
                            > 
                                <div>
                                    <p
                                    > {activity.title} </p>
                                </div>
                                <div>
                                    <LinkOutlined onClick={() => {window.open(activityPath(activity));}}/>
                                </div>
                            </div> 
                        ))}
                        {recentActivity.length > 0 && (
                            <div style={{ marginTop: '1em' }}>
                                <Button onClick={handleClearRecentActivity}>Clear Recent Activity</Button>
                            </div>
                        )}
                    </Panel>
                </Collapse>
                <Button onClick={() => {
                    onClose();
                    navigate(`/Profile/${user.username}`);
                    window.location.reload();
                }}
                >View Profile</Button>
                <Button onClick={handleLogout}>Logout</Button>
            </Drawer>
        </div>
    )
}

export default AvatarBar;