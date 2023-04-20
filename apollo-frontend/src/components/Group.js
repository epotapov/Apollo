import { React, useState, useEffect } from "react";
import { Avatar, Button, message, Form, Input, Modal, Spin } from "antd";

import { useUserContext } from '../hooks/useUserContext';
import { useParams, useNavigate } from "react-router-dom";
import Forum from './Forum';
import defpfp from '../img/defaultpfp.png';


import Navbar from "./Navbar";

export default function Group() {
    const { groupName } = useParams();
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Are you sure you want to delete this thread?');
    const [deletedThread, setDeletedThread] = useState("");
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [admin, setAdmin] = useState({});
    const { user } = useUserContext();
    const [groupList, setGroupList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({ title: '', description: '' });

    useEffect(() => {
        const fetchGroup = async () => {
            setIsLoading(true);
            await fetch('http://localhost:5001/api/group/' + groupName)
            .then(response => response.json())
            .then(data => {
                setTitle(data.title);
                console.log(data.title)
                setDescription(data.description);
                setFormData({ title: data.title, description: data.description });
                setIsLoading(false);
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
        setConfirmLoading(true);
        setOpen(false);
        setConfirmLoading(false);
    };

    const handleCancel = () => {
        form.resetFields();
        setOpen(false);
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
        <>
            <Navbar/>
            <div className='namePage'>
                <h1> {title} </h1>
            </div>
            <div className='bodyPage'>
                <h2>Description: </h2>
                <p> {description} </p>
                <span id="groupButtons">
                    { user && admin.username === user.username &&
                        <>
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
                                <Form form={form} initialValues={{title: title, description: description}} name="editGroup">
                                    <Form.Item name="title" rules={[{ required: true, message: "Please enter a title" }]}>
                                        <Input placeholder="Title" onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                                    </Form.Item>
                                    <Form.Item name="description" rules={[{ required: true, message: "Please enter your post description" }]}>
                                        <Input.TextArea rows={4} placeholder="Post Description" onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                    </Form.Item>
                                </Form>
                            </Modal>
                            <Button onClick={handleDelete} type="primary" danger>Delete Group</Button>
                        </>
                    }
                    { user && !checkList(user.username) && user.username !== admin.username &&
                        <Button onClick={handleJoin} type="primary">Join Group</Button>
                    }
                    { user && checkList(user.username) && user.username !== admin.username &&
                        <Button onClick={handleLeave} type="primary" danger>Leave Group</Button> 
                    }
                </span>
                <div className="GroupLinks">
                    <h2>Group Owner: </h2>
                    <span> 
                        <Avatar 
                            src={admin.profilePicture !== "default" ? `http://localhost:5001/pictures/${admin.profilePicture}` : defpfp } 
                            onClick={() => {window.open(`/Profile/${admin.username}`);}}
                        />
                        <a target="_blank" href={`/Profile/${admin.username}`}> {admin.username}</a>                                        
                    </span>
                    <p>{/*Title*/}</p>
                    <h2>Group Members: </h2>
                    {groupList.map((member) => (
                        <div key={member.username}>
                            <Avatar 
                                src={member.profilePicture !== "default" ? `http://localhost:5001/pictures/${member.profilePicture}` : defpfp } 
                                onClick={() => {window.open(`/Profile/${member.username}`);}}
                            />
                            <a target="_blank" href={`/Profile/${member.username}`}> {member.username} </a>
                        </div>
                    ))}
                </div>
                
                {/*<Forum courseName={courseName} type={'Public'}  />*/}
            </div>
        </>
    )
}