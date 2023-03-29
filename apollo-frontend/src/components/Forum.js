import { React, useState, useEffect } from 'react';
import { Collapse, Form, Input, Button, Typography, Space } from "antd";
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import { useUserContext } from '../hooks/useUserContext';
const { Panel } = Collapse;
const { Title } = Typography;

const Forum = ( {courseName} ) => {
    const {user} = useUserContext();
    const [threads, setThreads] = useState([]);

    const formatThreads = (data) => {
        for (let i = 0; i < data.length; i++) {
            const _id = data[i]._id;
            const title = data[i].title;
            const description = data[i].description;
            const upvotes = data[i].upvotes;
            const downvotes = data[i].downvotes;
            const comments = data[i].comments;
            const username = data[i].username;
            const thread = {
                id: _id,
                title: title,
                description: description,
                upvotes : upvotes ? Object.entries(upvotes).length : 0,
                downvotes: downvotes ? Object.entries(downvotes).length : 0,
                comments: comments,
                username: username
            }
            setThreads(threads => [...threads, thread]);
        }
    }   

    useEffect(() => {
        if (courseName.length !== 0) {
            const fetchThreads = async () => {
                fetch("http://localhost:5001/api/thread/" + courseName)
                .then(response => response.json())
                .then(data => {
                    setThreads([]);
                    formatThreads(data);
                }) 
            };

            fetchThreads();
        }
    }, [courseName]);

    const handleCreateThread = async (values) => {
        const title = values.title;
        const content = values.content;
        const course = courseName;
        const username = user.username;
        const body = {
            title: title,
            description: content,
            courseName: course,
            username: username
        }
    
        const response = await fetch('http://localhost:5001/api/thread/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        const data = await response.json();
        formatThreads(data);
    }

    const handleAddComment = async (values, threadId) => {
        
        const description = values.content;
        const username = user.username;
        const threadIndex = threads.findIndex((thread) => thread.id === threadId);
        const thread = threads[threadIndex];
        let newComments;

        const response = await fetch(`http://localhost:5001/api/thread/${threadId}/createComment`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username, description: description})
        })
        .then(response => response.json())
        .then(data => {
            newComments = data.comments;
        })
    
        const updatedThread = {
          ...thread,
          comments: newComments,
        };
    
        const updatedThreads = [
          ...threads.slice(0, threadIndex),
          updatedThread,
          ...threads.slice(threadIndex + 1),
        ];
    
        setThreads(updatedThreads); 
        console.log(threads);
    }

    const handleUpVote = async (threadId) => {
        if (!user) {
            alert("Please login to upvote");
            return;
        }
        const response = await fetch(`http://localhost:5001/api/thread/${threadId}/upvote`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: user.username})
        })
        
        const threadIndex = threads.findIndex((thread) => thread.id === threadId);
        const thread = threads[threadIndex];

        let updatedThread = {}; 
      
        if (response.status === 209) {
            updatedThread = {
            ...thread,
            upvotes: thread.upvotes - 1,
            };
        }
        else if (response.status === 210) {
            updatedThread = {
            ...thread,
            upvotes: thread.upvotes + 1,
            downvotes: thread.downvotes - 1
            };
        }
        else {
            updatedThread = {
            ...thread,
            upvotes: thread.upvotes + 1,
            };
        }
      
        const updatedThreads = [
          ...threads.slice(0, threadIndex),
          updatedThread,
          ...threads.slice(threadIndex + 1),
        ];

        setThreads(updatedThreads);
    }

    const handleDownVote = async (threadId) => {
        if (!user) {
            alert("Please login to downvote");
            return;
        }
        const response = await fetch(`http://localhost:5001/api/thread/${threadId}/downvote`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: user.username})
        })

        const threadIndex = threads.findIndex((thread) => thread.id === threadId);
        const thread = threads[threadIndex];
      
        let updatedThread = {};
        if (response.status === 209) {
            updatedThread = {
            ...thread,
            downvotes: thread.downvotes - 1,
            };
        }
        else if (response.status === 210) {
            updatedThread = {
            ...thread,
            downvotes: thread.downvotes + 1,
            upvotes: thread.upvotes - 1
            };
        }
        else {
            updatedThread = {
            ...thread,
            downvotes: thread.downvotes + 1,
            };
        }
      
        const updatedThreads = [    
          ...threads.slice(0, threadIndex),
          updatedThread,
          ...threads.slice(threadIndex + 1),
        ];

        setThreads(updatedThreads);
    }

    return (
        <div>
            <Title level={2}> Forum for {courseName} </Title>
            {threads.length === 0 ? (
                <div>
                    <Title level={4}> No threads yet! </Title>
                </div>
            ) : (
                <Collapse> 
                    {threads.map((thread) => (
                        <Panel
                            header={
                                <Space>
                                    {thread.title}
                                    <span> by {thread.username} </span>
                                    <span>
                                        <Button shape="Circle" icon={<LikeOutlined />} onClick={() => handleUpVote(thread.id)} />
                                        {thread.upvotes}
                                    </span>
                                    <span>
                                        <Button shape="Circle" icon={<DislikeOutlined />} onClick={() => handleDownVote(thread.id)} />
                                        {thread.downvotes}
                                    </span>
                                </Space>
                            }
                            key={thread.id}
                        >
                            <p> {thread.description} </p>
                            <h3> Comments </h3>
                            {threads.length !== 0 && (
                                <ul style={{display: "flex", flexDirection: "column", listStyleType: "none", padding: 0}}>
                                    {thread.comments.map(comment => (
                                        <li key={comment._id}>
                                            <div>
                                                <span> {comment.username}: </span>
                                                <span> {comment.description} </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <Collapse>
                                {user && (
                                    <Panel header="Add Comment">
                                        <Form name="comment" onFinish={(values) => handleAddComment(values, thread.id)}>
                                            <Form.Item name="content" rules={[{ required: true, message: "Please enter your comment" }]}>
                                            <Input.TextArea rows={4} placeholder="Comment" />
                                            </Form.Item>
                                            <Form.Item>
                                            <Button type="primary" htmlType="submit">
                                                Add Comment
                                            </Button>
                                            </Form.Item>
                                        </Form>
                                    </Panel>
                                )}
                            </Collapse>
                    </Panel>           
                    ))}
                </Collapse>
            )}
            {user ? (
                <div>
                    <Title level={3}> Create a new thread </Title>
                    <Form name="thread" onFinish={(values) => handleCreateThread(values)}>
                        <Form.Item name="title" rules={[{ required: true, message: "Please enter a title" }]}>
                            <Input placeholder="Title" />
                        </Form.Item>
                        <Form.Item name="content" rules={[{ required: true, message: "Please enter your post content" }]}>
                            <Input.TextArea rows={4} placeholder="Post Content"/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Create Thread
                            </Button>
                        </Form.Item>
                    </Form>  
                </div>
            ) : (
                <div>
                    <Title level={3}> Please login to create a thread </Title>
                </div>
            )}        
        </div>
    )
}

export default Forum;