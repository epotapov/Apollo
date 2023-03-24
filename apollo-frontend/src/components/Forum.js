import { React, useState, useEffect } from 'react';
import { Collapse, Form, Input, Button, Typography, Space } from "antd";
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import { useUserContext } from '../hooks/useUserContext';
const { Panel } = Collapse;
const { Title } = Typography;

const Forum = ( {courseName} ) => {
    const {user} = useUserContext();
    let threads = [];

    useEffect(() => {
        const fetchThreads = async () => {
            const url = `http://localhost:5001/api/thread/${courseName}`
            fetch(url)
            .then(response => response.json())
            .then(data => {
                threads = data;
            }) 
        };
    fetchThreads();
    }, [courseName]);

    const form = Form.useForm();

    const handleCreateThread = async (values) => {
        const title = values.title;
        const content = values.content;
        const course = courseName;
        const username = user.username;
        console.log(title, content, course, username);
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
        threads = data; 
    }

    const handleAddComment = async (values, threadId) => {
        // Need to wait for Comment API to be implemented
    }

    const handleUpVote = async (threadId) => {
        const updatedThreads = threads.map((thread) => {
            if (thread.id === threadId) {
                return { ...thread, upvotes: thread.upvotes + 1}
            }
            return thread;
        });

        threads = updatedThreads;
        fetch(`http://localhost:5001/api/thread/${threadId}/upvote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: user.username})
        })
    }

    const handleDownVote = async (threadId) => {
        const updatedThreads = threads.map((thread) => {
            if (thread.id === threadId) {
                thread.downvotes += 1;
            }
            return thread;
        });

        threads = updatedThreads;
        fetch(`http://localhost:5001/api/thread/${threadId}/downvote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: user.username})
        })
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
                            {thread.comments === null ? (
                                <p> No comments yet! </p>
                            ) : (
                                <Collapse>
                                    {thread.comments.map((comment) => (
                                        <Panel header={<Space> comment.username </Space>} key={comment.id}>
                                            <p> {comment.description} </p>
                                        </Panel>
                                    ))}
                                    {user && (
                                        <Panel header="Add Comment">
                                            <Form name="comment" onFinish={(values) => handleAddComment(values, thread.id)} form={form}>
                                                <Form.Item name="user" rules={[{ required: true, message: "Please enter your name" }]}>
                                                <Input placeholder="Name" />
                                                </Form.Item>
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
                            )}
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