import { React, useState, useEffect } from "react";
import { Avatar, Button, message, Form, Input, Modal, Spin } from "antd";

import { useUserContext } from '../hooks/useUserContext';
import { useParams } from "react-router-dom";
import Forum from './Forum';


import Navbar from "./Navbar";

export default function Group() {
    const { groupName } = useParams();
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Are you sure you want to delete this thread?');
    const [deletedThread, setDeletedThread] = useState("");
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGroup = async () => {
            console.log("help")
            setIsLoading(true);
            await fetch('http://localhost:5001/api/group/get/' + groupName)
            .then(response => response.json())
            .then(data => {
                setTitle(data.title);
                console.log(data.title)
                setDescription(data.description);
            })
            setIsLoading(false);
        }
        fetchGroup();
    }, [groupName]);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        //deleteThread(deletedThread);
        setOpen(false);
        setConfirmLoading(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    if (title === '') {
        return (
            <div>
                {isLoading ? (
                    <div>
                        <Navbar />
                        <Spin size="large" />
                    </div>
                ) : (
                <div>
                    <Navbar />
                    <h1>Course does not exist</h1>
                </div>
                )}
            </div>
        )
    }
    else 
        return(
            <>
                <Navbar/>
                <div className='namePage'>
                    <h1> {title} </h1>
                </div>
                <div className='bodyPage'>
                    <h2>Description: </h2>
                    <p> {description} </p>
                    <h2>Group Owner: </h2>
                    <p>{/*Title*/}</p>
                    <h2>Group Members: </h2>
                    {/*<span> 
                        <Avatar 
                            src={thread.userPfp !== "default" ? `http://localhost:5001/pictures/${thread.userPfp}` : defpfp } 
                            onClick={() => {window.open(`/Profile/${thread.username}`);}}
                        />
                        <a target="_blank" href={`/Profile/${thread.username}`}> {thread.username}: </a>
                        <span> {thread.title} </span>                                        
                    </span>*/}
                    <p>{/*Title*/}</p>
                    <span id="groupButtons">
                        <Button type="primary" onClick={() => {
                            showModal();
                        }}>Edit Group</Button>
                        <Modal
                            title="Edit Group"
                            open={open}
                            onOk={handleOk}
                            confirmLoading={confirmLoading}
                            onCancel={handleCancel}
                        >
                            <Form name="editGroup">
                                <Form.Item name="title" rules={[{ required: true, message: "Please enter a title" }]}>
                                    <Input placeholder="Title" />
                                </Form.Item>
                                <Form.Item name="description" rules={[{ required: true, message: "Please enter your post description" }]}>
                                    <Input.TextArea rows={4} placeholder="Post Description"/>
                                </Form.Item>
                                <Form.Item>
                                </Form.Item>
                            </Form>
                        </Modal>
                        <Button type="primary">Join Group</Button>
                        <Button type="primary" danger>Delete Group</Button>
                        <Button type="primary" danger>Leave Group</Button> 
                    </span>
                    
                    {/*<Forum courseName={courseName} type={'Public'}  />*/}
                </div>
            </>
        )
}