import React, { useState, useEffect } from "react";
import { Avatar, Button, Drawer, message, Badge, Collapse, Card, Typography, Popover} from "antd";
import { useLogout } from '../hooks/useLogout';
import { useUserContext } from '../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';
import defpfp from '../img/defaultpfp.png';
import { CheckCircleOutlined, CloseCircleOutlined, LinkOutlined} from "@ant-design/icons";
import FriendRecentActivity from './FriendRecentActivity';
import NotificationHandler from './NotificationHandler';

const { Panel } = Collapse;
const { Text } = Typography;

const AvatarBar = (props) => {
    const [visible, setVisible] = useState(false);
    let {user: outerUser} = useUserContext();
    const [user, setUser] = useState(outerUser ? outerUser.user : null);    
    const { logout } = useLogout();
    let pfp = props.pic;
    const navigate = useNavigate();

    const [recentActivity, setRecentActivity] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [friendsList, setFriendsList] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [timeline, setTimeline] = useState([]);


    useEffect(() => {
        if (user) {
            if (pfp === 'default' || pfp === "" || pfp === null) {
                pfp = defpfp;
            }
            else {
                pfp = props.pic;
            }
            formatFriendList(user.friendsList ? user.friendsList : []);
            formatTimeLine(user.friendsList ? user.friendsList : []);
            formatNotifications(user.notifications ? user.notifications : []);
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

    const formatNotifications = (notifications) => {
        let notificationList = [];
        for (let i = 0; i < notifications.length; i++) {
            let path = "/";
            if (notifications[i].type === "profile") {
                path = "/Profile/" + notifications[i].sender;
            } else if (notifications[i].type === "Chat") {
                path = "/Chat/";
            } else if (notifications[i].type === "course") {
                path = "/Course/" + notifications[i].path;
            } else if (notifications[i].type === "group") {
                path = "/Group/" + notifications[i].path;
            }

            notificationList.push({
                title: notifications[i].title,
                type: notifications[i].type,
                path: path,
                sender: notifications[i].sender ? notifications[i].sender : "",
                isRead: notifications[i].isRead,
                id: notifications[i]._id
            });
        }
        setNotifications(notificationList);
    }

    const formatTimeLine = async (friends) => {
        let timelineList = [];
        for (let i = 0; i < friends.length; i++) {
            const response = await fetch('http://localhost:5001/api/user/get/' + friends[i].username);
            const data = await response.json();
            let currTimeLine = [];

            for (let j = 0; j < data.recentActivity.length; j++) {
                currTimeLine.push({
                    title: data.recentActivity[j].split(":")[0],
                    type: data.recentActivity[j].split(":")[1],
                    path: data.recentActivity[j].split(":")[2]
                });
            }
            timelineList.push({
                username: friends[i].username,
                profilePicture: friends[i].profilePicture,
                recentActivity: currTimeLine
            });
        }
        setTimeline(timelineList);
    }

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

    const updateUser = (newUser) => {
        setUser(newUser);
    } 

    const markAllAsRead = async () => {
        const response = await fetch(`http://localhost:5001/api/user/markAllAsRead`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: user.username
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                setUser(data.user);
                formatNotifications(user.notifications);
                message.success("Marked all as read", 3);
            }
        })
        .catch(error => {
            message.error('Connection Error');
        });
    }

    const markAsRead = async (notification) => {
        const response = await fetch(`http://localhost:5001/api/user/markAsRead/${notification.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: user.username
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                setUser(data.user);
                formatNotifications(user.notifications);
            }
        }
        )
        .catch(error => {
            message.error(error.message);
            console.log(error);
        }
        );
    }

    const markAsUnread = async (notification) => {
        const response = await fetch(`http://localhost:5001/api/user/markAsUnread/${notification.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: user.username
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                setUser(data.user);
                formatNotifications(user.notifications);
            }
        }
        )
        .catch(error => {
            message.error(error.message);
            console.log(error);
        }
        );
    }

    const NotificationCard = ({ notification }) => {
        const { id, title, path, isRead } = notification;
        const handleClickLink = (notifcation) => {
            markAsRead(notification);
            window.open(path);
        };
        return (
            <Card
            key={id}
            hoverable={!isRead}
            style={{ marginBottom: 10 }}
            bodyStyle={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
            <div>
                <Text strong={!isRead}>{title}</Text>
            </div>
            <div>
                {path && (
                    <Popover content={"Navigate"} trigger={"hover"}>
                        <LinkOutlined
                        style={{ marginRight: 10 }}
                        onClick={() => handleClickLink(notification)}
                        />
                    </Popover>
                )}
                {isRead ? (
                <Text
                    type="secondary"
                    style={{ cursor: 'pointer', textDecoration: 'underline', color: '#1890ff'}}
                    onClick={() => markAsUnread(notification)}
                >
                        Mark as unread
                </Text>
                ) : (
                    <Text
                        type="secondary"
                        style={{ cursor: 'pointer', textDecoration: 'underline', color: '#1890ff'}}
                        onClick={() => markAsRead(notification)}
                        >
                        Mark as read
                    </Text>
                )}
            </div>
            </Card>
        );
    };

    return (
        <div className="avatar-bar">
            <NotificationHandler update={updateUser} user={outerUser} />
            {user && user.inAppNotifs ? (
            <Badge count={notifications.filter(notification => !notification.isRead).length}>
                <Avatar 
                    className="avatar"
                    size={35}
                    src={pfp}
                    onClick={showDrawer}
                    shape="circle"
                    style={{ cursor: "pointer", marginRight: "10px"}}
                />
            </Badge>
            ) : (
                <Avatar 
                className="avatar"
                size={35}
                src={pfp}
                onClick={showDrawer}
                shape="circle"
                style={{ cursor: "pointer", marginRight: "10px"}}
                /> )}
            <Drawer
                title="Profile Menu and Settings"
                placement="right"
                closable={true}
                onClose={onClose}
                open={visible}
            >
                <Collapse>
                    {user && user.inAppNotifs && (
                    <Panel header="Notifications" key="0" collapsible={notifications.length > 0}>
                        {notifications.filter(notification => !notification.isRead).length > 0 && (
                            <div style={{ marginTop: '1em' }}>
                                <Button onClick={markAllAsRead}>Mark all as read</Button>
                            </div>
                        )}
                        <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                            {notifications.map((notifcation) => (
                                <NotificationCard notification={notifcation} />
                            ))}
                        </div>
                    </Panel>
                    )}
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
                                    <Popover content={"Navigate"} trigger={"hover"}>
                                        <LinkOutlined onClick={() => {window.open(activityPath(activity));}}/>
                                    </Popover>
                                </div>
                            </div> 
                        ))}
                        {recentActivity.length > 0 && (
                            <div style={{ marginTop: '1em' }}>
                                <Button onClick={handleClearRecentActivity}>Clear Recent Activity</Button>
                            </div>
                        )}
                    </Panel>
                    <Panel header="Friend's Timeline" key="4" collapsible={friendsList.length > 0}>
                        {timeline.map((friend) => (
                            friend.recentActivity.length > 0 &&
                            <div key={friend.username} style={{ display: 'flex', marginBottom:'10px', paddingBottom: '5px',  justifyContent: 'space-between', alignItems: 'center'}}>
                                <FriendRecentActivity friend={friend} />
                            </div>
                        ))}
                    </Panel>
                </Collapse>
                <br/>
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