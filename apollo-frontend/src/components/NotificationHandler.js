import React, { useState, useEffect } from "react";
import {notification} from 'antd';
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5001"
var socket;

const NotificationHandler = (props) => {
    const [socketConnected, setSocketConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [profThreads, setProfThreads] = useState([]);
    const outerUser = props.user;
    const inAppNotifs = props.user.user.inAppNotifs;

    useEffect(() => {
        if (!socketConnected) {
            socket = io(ENDPOINT);
            socket.emit('setup', outerUser);
            socket.on('connected', () => setSocketConnected(true));
        }
    })

    useEffect(() => {
        if (!socketConnected) return;
        if (!inAppNotifs) return;
        console.log("socket connected: ", socketConnected);
        socket.on("message recieved", (newMessageRecieved) => {
            console.log("new message recieved: ", newMessageRecieved);
            if (!messages.includes(newMessageRecieved)) {
                messages.push(newMessageRecieved);
                const response = fetch('http://localhost:5001/api/user/addNotification', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: outerUser.username,
                        title: newMessageRecieved.sender.username + ' has sent you a message ' + newMessageRecieved.content.substring(0, 5) + '...',
                        path: '/Chat/',
                        type: 'Chat',
                        sender: newMessageRecieved.sender.username,
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.user) {
                        props.update(data.user);
                        notification.open({
                            message: 'New Message',
                            description: newMessageRecieved.sender.username + ' has sent you a message ',
                            placement: 'topLeft',
                            duration: 3,
                        })
                    }
                })
            }
        });
        socket.on("friend request recieved", (request) => {
            if (!friendRequests.includes(request.sender.username)) { 
                friendRequests.push(request.sender.username);
                console.log("friend request recieved: ", request);
                if (outerUser.user.friendRequests.includes(request.sender.username)) return;
                const response = fetch('http://localhost:5001/api/user/addNotification', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: request.user.username,
                        title: request.sender.username + ' has sent you a friend request',
                        path: request.sender.username,
                        type: 'profile',
                        sender: request.sender.username,
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.user) {
                        props.update(data.user);
                        notification.open({
                            message: 'New Friend Request',
                            description: request.sender.username + ' has sent you a friend request',
                            placement: 'topLeft',
                            duration: 3,
                        })
                    }
                })
            }
        })
        socket.on("Professor Thread Posted", (thread) => {
            if (!profThreads.includes(thread.threadid)) {
                profThreads.push(thread.threadid);
                const response = fetch('http://localhost:5001/api/user/addNotification', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: outerUser.username,
                        title: "New thread post on professor thread in course " + thread.course,
                        path: thread.course,
                        type: 'course',
                        sender: null,
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.user) {
                        props.update(data.user);
                        notification.open({
                            message: 'New Thread',
                            description: "There is a new thread post on the proffesor thread in course " + thread.course,
                            placement: 'topLeft',
                            duration: 3,
                        })
                    }
                })
            }   
        })
    })
}

export default NotificationHandler;