import { React, useState, useEffect } from "react";
import { Avatar, Button, message, Form, Input, Modal, Spin } from "antd";
import { useUserContext } from '../hooks/useUserContext';
import { useParams } from "react-router-dom";


import Navbar from "./Navbar";

export default function Group() {
    const { groupName } = useParams();
    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [groupOwner, setGroupOwner] = useState("");
    const [groupMembers, setGroupMembers] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const form = Form.useForm();

    useEffect(() => {
        const fetchGroup = async () => {
            setIsLoading(true);
            await fetch('http://localhost:5001/api/group/' + groupName)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setTitle(data.title);
                setDescription(data.description);
                setGroupOwner(data.admin);
                setGroupMembers(data.members);
            })
            .catch(error => {
                message.error('Connection Error');
                setIsLoading(true);
            });
            await fetch('http://localhost:5001/api/group/members/' + groupName)
            .then(response => response.json())
            .then(data => {
                setAdmin(data.admin)
                setGroupList(data.members);
                setIsLoading(false);
            })
            .catch(error => {
                message.error('Connection Error');
                setIsLoading(true);
            });
        }
        fetchGroup();
    }, [groupName]);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setOpen(false);
        form.resetFields();
    };

    const handleCancel = () => {
        setOpen(false);
        form.resetFields();
    };

    const checkList = (username) => {
        for (let i = 0; i < groupList.length; i++) {
            if (username === groupList[i].username) {
                return true;
            }
        }
        return false;
    }

    const handleLeave = async () => {

        const response = await fetch('http://localhost:5001/api/group/leave/' + groupName, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.userToken}`
            }
        });

        const json = await response.json();
        console.log(json)

        if (!response.ok) {
            message.error(json.message)
        }

        if (response.ok) {
            message.success(`You left ${title}!`);
            await fetch('http://localhost:5001/api/group/members/' + groupName)
            .then(response => response.json())
            .then(data => {
                setAdmin(data.admin)
                setGroupList(data.members);
            })
            .catch(error => {
                message.error('Connection Error');
            });
        }
    }

    const handleJoin = async () => {

        const response = await fetch('http://localhost:5001/api/group/join/' + groupName, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.userToken}`
            }
        });

        const json = await response.json();
        console.log(json)

        if (!response.ok) {
            message.error(json.message)
        }

        if (response.ok) {
            message.success(`You joined ${title}!`);
            await fetch('http://localhost:5001/api/group/members/' + groupName)
            .then(response => response.json())
            .then(data => {
                setAdmin(data.admin)
                setGroupList(data.members);
            })
            .catch(error => {
                message.error('Connection Error');
            });
        }
    }

    const handleDelete = async () => {

        const response = await fetch('http://localhost:5001/api/group/delete/' + groupName, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.userToken}`
            }
        });

        const json = await response.json();
        console.log(json)

        if (!response.ok) {
            message.error(json.message)
        }

        if (response.ok) {
            message.success(`You deleted ${title}!`);
            navigate("/");
        }
    }

    const handleEdit = async () => {

    }


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
     
    return(
        <div>
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
                        onCancel={handleCancel}
                    >
                        <Form name="editGroup">
                            <Form.Item name="title" rules={[{ required: true, message: "Please enter a title" }]}>
                                <Input placeholder="Title" defaultValue={title} />
                            </Form.Item>
                            <Form.Item name="description" rules={[{ required: true, message: "Please enter your post description" }]}>
                                <Input.TextArea rows={4} placeholder="Post Description" defaultValue={description}/>
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Button type="primary">Join Group</Button>
                    <Button type="primary" danger>Delete Group</Button>
                    <Button type="primary" danger>Leave Group</Button> 
                </span>
                
                {/*<Forum courseName={courseName} type={'Public'}  />*/}
            </div>
        </div>
    )
}