import React, { useState, useEffect } from "react";
import { LinkOutlined, DownOutlined, UpOutlined} from "@ant-design/icons";
import defpfp from '../img/defaultpfp.png';
import { Avatar } from 'antd';

const FriendRecentActivity = (props) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const friend = props.friend;

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
        <div> 
            <div onClick={() => setIsExpanded(!isExpanded)} style={{cursor: "pointer", display: 'flex', alignItems: 'center'}}>
                <div>
                    <Avatar
                        src={friend.profilePicture !== "default" ? `http://localhost:5001/pictures/${friend.profilePicture}` : defpfp }
                        onClick={() => {window.open(`/Profile/${friend.username}`);}}
                    />
                    <a target="_blank" href={`/Profile/${friend.username}`}> {friend.username} </a>
                </div>
                <div style={{ fontsize: "10px", marginLeft: "10px" }}> {isExpanded ? '-' : '+'} </div>
            </div>
            {isExpanded && 
                friend.recentActivity.map((activity) => (
                <div key={activity.title}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #d9d9d9' }}>
                    <div>
                        <p> {friend.username} {activity.title} </p>
                    </div>
                    <div>
                        <LinkOutlined onClick={() => { window.open(activityPath(activity)); }} />
                    </div>
                </div>
                ))
            }
        </div>
    )
}

export default FriendRecentActivity;