import { React, useState, useEffect } from 'react';
import { Collapse, Form, Input, Button, Typography, Space, message, Avatar, Modal, Select, Tag } from "antd";
import { LikeOutlined, DislikeOutlined, PlusOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import { useUserContext } from '../hooks/useUserContext';
import defpfp from '../img/defaultpfp.png';

const { Panel } = Collapse;
const { Title } = Typography;

const tagPair = { "General": "magenta", "Homework": "purple", "Projects": "orange",
                  "Quizzes": "red", "Lab": "green", "Exams": "geekblue", "Social": "volcano",
                  "Other": "blue" }; 

const Forum = (props) => {
    const courseName = props.courseName ? props.courseName : '';
    const isProf = props.type === 'Professor' ? true : false;
    const [threads, setThreads] = useState([]);
    const [subButtonDisabled, setsubButtonDisabled] = useState(false);
    const [tag, setTag] = useState("");
    const [tagFilter, setTagFilter] = useState("All")
    const [threadForm] = useForm();
    const [commentForm] = useForm();

    //modal stuff
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Are you sure you want to delete this thread?');
    const [deletedThread, setDeletedThread] = useState("");

    //comment modal
    const [openComment, setOpenComment] = useState(false);
    const [confirmCommentLoading, setConfirmCommentLoading] = useState(false);
    const [modalCommentText, setModalCommentText] = useState('Are you sure you want to delete this comment?');
    const [deletedComment, setDeletedComment] = useState("");

    const showModal = () => {
        setModalText('Are you sure you want to delete this thread?')
        setOpen(true);
    };

    const showCommentModal = () => {
        setModalCommentText('Are you sure you want to delete this comment?')
        setOpenComment(true);
    };

    const handleOk = () => {
        setModalText('Deleting Thread...');
        setConfirmLoading(true);
        deleteThread(deletedThread);
        setOpen(false);
        setConfirmLoading(false);
    };

    const handleCommentOk = () => {
        setModalCommentText('Deleting Comment...');
        setConfirmCommentLoading(true);
        deleteComment(deletedThread, deletedComment);
        setOpenComment(false);
        setConfirmCommentLoading(false);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    const handleCommentCancel = () => {
        console.log('Clicked cancel button');
        setOpenComment(false);
    };

    const formatThreads = (data) => {
        setThreads([]);
        for (let i = 0; i < data.length; i++) {
            const _id = data[i]._id;
            const title = data[i].title;
            const description = data[i].description;
            const tag = data[i].tag;
            const upvotes = data[i].upvotes;
            const downvotes = data[i].downvotes;
            const comments = data[i].comments;
            const username = data[i].username;
            const subscribed = data[i].subscribed[username] ? true : false;
            const isProfThread = data[i].isProfThread;
            const pfp = data[i].userPfp;
            const thread = {
                id: _id,
                title: title,
                description: description,
                tag: tag,
                upvotes : upvotes ? Object.entries(upvotes).length : 0,
                downvotes: downvotes ? Object.entries(downvotes).length : 0,
                comments: comments,
                username: username,
                subscribed: subscribed,
                isProfThread: isProfThread,
                userPfp: pfp
            }
            if (thread.isProfThread && isProf) {
                setThreads(threads => [...threads, thread]);
            }
            else if (!thread.isProfThread && !isProf) {
                setThreads(threads => [...threads, thread]);
            }
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
                .catch(error => {
                    message.error('Connection Error');
                });
            };

            fetchThreads();
        }
    }, [courseName]);

    let {user: outerUser} = useUserContext();
    const [user, setUser] = useState(outerUser ? outerUser.user : null);


    const handleSubscribe = async (threadId) => {
        if (subButtonDisabled) {
            return;
        }
        const updatedThreads = threads.map((thread) => {
            if (thread.id === threadId) {
                if (thread.subscribed) {
                    message.success('Succesfully unsubscribed from thread', 1);
                } else {
                    message.success('Succesfully subscriped to thread', 1);
                }
                return {
                    ...thread,
                    subscribed: !thread.subscribed
                }
            }
            return thread;
        })
        setThreads(updatedThreads);

        const response = await fetch(`http://localhost:5001/api/thread/${threadId}/subscribeToThread`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: threadId, username: user.username})
        })
        .catch(error => {
            message.error('Connection Error');
        });

        // Time out button for 3 seconds so no spamming
        setsubButtonDisabled(true);
        setTimeout(() => {
            setsubButtonDisabled(false);
        }, 3000);
    }

    const handleCreateThread = async (values) => {
        const title = values.title;
        const content = values.content;
        const tagName = tag;
        const course = courseName;
        const username = user.username;
        const isProfThread = isProf;
        const pfp = user.profilePicture ? user.profilePicture : "default";
        const body = {
            title: title,
            description: content,
            tag: tagName,
            courseName: course,
            username: username,
            isProfThread: isProfThread,
            pfp: pfp
        }
    
        const response = await fetch('http://localhost:5001/api/thread/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .catch(error => {
            message.error('Connection Error');
        });

        const data = await response.json();
        formatThreads(data);
        console.log(data);
        threadForm.resetFields();
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
            body: JSON.stringify({username: username, description: description, pfp: user.profilePicture ? user.profilePicture : "default"})
        })
        .then(response => response.json())
        .then(data => {
            newComments = data.comments;
        })
        .catch(error => {
            message.error('Connection Error');
        });
    
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
        commentForm.resetFields();
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
        .catch(error => {
            message.error('Connection Error');
        });
        
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
        .catch(error => {
            message.error('Connection Error');
        });

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

    const deleteThread = async (threadId) => {
        const response = await fetch(`http://localhost:5001/api/thread/${threadId}/deleteThread`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: user.username})
        })

        if (!response.ok) {
            message.error(`Thread delete failed.`);
            return;
        }
        fetch("http://localhost:5001/api/thread/" + courseName)
        .then(response => response.json())
        .then(data => {
            setThreads([]);
            formatThreads(data);
        })
        .catch(error => {
            message.error('Error data:', error);
        });
        message.success("Thread was deleted")
    }

    const deleteComment = async (threadId, CommentId) => {
        const response = await fetch(`http://localhost:5001/api/thread/${threadId}/${CommentId}/removeComment`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: user.username})
        })

        if (!response.ok) {
            message.error(`Comment delete failed.`);
            return;
        }

        fetch("http://localhost:5001/api/thread/" + courseName)
        .then(response => response.json())
        .then(data => {
            setThreads([]);
            formatThreads(data);
        })
        .catch(error => {
            message.error('Error data:', error);
        });
        message.success("Comment was deleted")
    }

    return (
        <div>
            {isProf ? ( 
                <Title level={2}> Professor Forum for {courseName} </Title>
            ) : (
                <Title level={2}> Forum for {courseName} </Title>
            )}
            {threads.length === 0 ? (
                <div>
                    <Title level={4}> No threads yet! </Title>
                </div>
            ) : (
                <>
                    <Select
                        defaultValue="All"
                        style={{ width: 120 }}
                        onChange={(val) => {setTagFilter(val)}}
                        options={[
                            { value: 'All', label: 'All' },
                            { value: 'General', label: 'General' },
                            { value: 'Homework', label: 'Homework' },
                            { value: 'Projects', label: 'Projects' },
                            { value: 'Quizzes', label: 'Quizzes' },
                            { value: 'Lab', label: 'Lab' },
                            { value: 'Exams', label: 'Exams' },
                            { value: 'Social', label: 'Social' },
                            { value: 'Other', label: 'Other' },
                        ]}
                    />
                    <br/>
                    <br/>
                    <Collapse collapsible='icon'> 
                        {threads.map((thread) => (
                            (thread.tag === tagFilter || tagFilter === "All") && <Panel
                                header={
                                    <Space>
                                        <span> 
                                            <Avatar 
                                                src={thread.userPfp !== "default" ? `http://localhost:5001/pictures/${thread.userPfp}` : defpfp } 
                                                onClick={() => {window.open(`/Profile/${thread.username}`);}}
                                            />
                                            <a target="_blank" href={`/Profile/${thread.username}`}> {thread.username}: </a>
                                            <span> {thread.title} </span>                                        
                                        </span>
                                        <span>
                                            <Tag color={tagPair[thread.tag]}>{thread.tag}</Tag>
                                        </span>
                                        <span>
                                            <Button shape="Circle" icon={<LikeOutlined />} onClick={() => handleUpVote(thread.id)} />
                                            {thread.upvotes}
                                        </span>
                                        <span>
                                            <Button shape="Circle" icon={<DislikeOutlined />} onClick={() => handleDownVote(thread.id)} />
                                            {thread.downvotes}
                                        </span>
                                        {user && (thread.subscribed ? (
                                            <Button disabled={subButtonDisabled} shape="Circle" icon={<CheckOutlined /> } onClick={() => handleSubscribe(thread.id)} />
                                        ) : (
                                            <Button disabled={subButtonDisabled} shape="Circle" icon={<PlusOutlined />} onClick={() => handleSubscribe(thread.id)} />
                                        ))}
                                        {
                                            user && user.username == thread.username &&
                                            <span>
                                                <Button shape="Circle" icon={<DeleteOutlined />} onClick={() => {
                                                    showModal();
                                                    setDeletedThread(thread.id);
                                                }} />
                                                <Modal
                                                    title="Deleting Thread"
                                                    open={open}
                                                    onOk={handleOk}
                                                    confirmLoading={confirmLoading}
                                                    onCancel={handleCancel}
                                                >
                                                    <p>{modalText}</p>
                                                </Modal>
                                            </span>
                                        }
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
                                                    <Avatar 
                                                    onClick={() => {window.open(`/Profile/${comment.username}`);}}
                                                    src={comment.userPfp !== "default" ? `http://localhost:5001/pictures/${comment.userPfp}` : defpfp } />
                                                    <a  target='_blank' href={`/Profile/${comment.username}`}> 
                                                        <span> {comment.username}: </span>
                                                    </a>
                                                    {
                                                        user && user.username == comment.username &&
                                                        <span>
                                                            <Button shape="Circle" icon={<DeleteOutlined />} onClick={() => {
                                                                showCommentModal();
                                                                setDeletedComment(comment._id);
                                                                setDeletedThread(thread.id);
                                                            }} />
                                                            <Modal
                                                                title="Deleting Comment"
                                                                open={openComment}
                                                                onOk={handleCommentOk}
                                                                confirmLoading={confirmCommentLoading}
                                                                onCancel={handleCommentCancel}
                                                            >
                                                                <p>{modalCommentText}</p>
                                                            </Modal>
                                                        </span>
                                                    }
                                                    <span> {comment.description} </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <Collapse collapsible='icon'>
                                    {user && (
                                        <Panel header="Add Comment">
                                            <Form form={commentForm} name="comment" onFinish={(values) => handleAddComment(values, thread.id)}>
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
                </>
            )}
            {user ? (
                isProf && user.isProf ? (
                    <div>
                        <Title level={3}> Create a new thread </Title>
                        <Form form={threadForm} onFinish={(values) => handleCreateThread(values)} id='create-thread'>
                            <Form.Item name="title" rules={[{ required: true, message: "Please enter a title" }]}>
                                <Input placeholder="Title" />
                            </Form.Item>
                            <Form.Item label="Tag" name="tag" rules={[{ required: true, message: "Please enter a tag" }]}>
                                <Select
                                    style={{ width: 120 }}
                                    onChange={(val) => {setTag(val)}}
                                    options={[
                                        { value: 'General', label: 'General' },
                                        { value: 'Homework', label: 'Homework' },
                                        { value: 'Projects', label: 'Projects' },
                                        { value: 'Quizzes', label: 'Quizzes' },
                                        { value: 'Lab', label: 'Lab' },
                                        { value: 'Exams', label: 'Exams' },
                                        { value: 'Social', label: 'Social' },
                                        { value: 'Other', label: 'Other' },
                                    ]}
                                />
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
                ) : !isProf ? (
                    <div>
                        <Title level={3}> Create a new thread </Title>
                        <Form form={threadForm} onFinish={(values) => handleCreateThread(values)} id='create-thread'>
                            <Form.Item name="title" rules={[{ required: true, message: "Please enter a title" }]}>
                                <Input placeholder="Title" />
                            </Form.Item>
                            <Form.Item label="Tag" name="tag" rules={[{ required: true, message: "Please enter a tag" }]}>
                                <Select
                                    style={{ width: 120 }}
                                    onChange={(val) => {setTag(val)}}
                                    options={[
                                        { value: 'General', label: 'General' },
                                        { value: 'Homework', label: 'Homework' },
                                        { value: 'Projects', label: 'Projects' },
                                        { value: 'Quizzes', label: 'Quizzes' },
                                        { value: 'Lab', label: 'Lab' },
                                        { value: 'Exams', label: 'Exams' },
                                        { value: 'Social', label: 'Social' },
                                        { value: 'Other', label: 'Other' },
                                    ]}
                                />
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
                    <p> </p>
                )
            ) : (
                <div>
                    <Title level={3}> Please login to create a thread </Title>
                </div>
            )}
        </div>
    )
}

export default Forum;