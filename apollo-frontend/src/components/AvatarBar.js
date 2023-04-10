import React, { useState, useEffect } from "react";
import { Avatar, Button, Drawer, message, Badge, Collapse} from "antd";
import { useLogout } from '../hooks/useLogout';
import { useUserContext } from '../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';
import defpfp from '../img/defaultpfp.png';

const { Panel } = Collapse;

const AvatarBar = (props) => {
    const [visible, setVisible] = useState(false);
    const {user: outerUser} = useUserContext();
    const [user] = useState(outerUser ? outerUser.user : null);    
    const { logout } = useLogout();
    let pfp = props.pic;
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (pfp === 'default' || pfp === "" || pfp === null) {
                pfp = defpfp;
            }
            else {
                console.log(props.pic)
                pfp = props.pic;
            }
        }
    }, []);

    const friendsList = [
        {
            username: "test",
            profilePicture: "default"
        },
        {
            username: "test2",
            profilePicture: "default"
        },
        {
            username: "test3",
            profilePicture: "default"
        },
    ]

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
                    <Panel header="Friends" key="1">
                        {friendsList.map((friend) => (
                            <div>
                                <Avatar 
                                    src={friend.profilePicture !== "default" ? `http://localhost:5001/pictures/${friend.profilePicture}` : defpfp } 
                                    onClick={() => {window.open(`/Profile/${friend.username}`);}}
                                />
                                <a target="_blank" href={`/Profile/${friend.username}`}> {friend.username}: </a>
                                key={friend.username}
                            </div>
                        ))}
                    </Panel>
                    <Panel header="Recent Activity" key="2">
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