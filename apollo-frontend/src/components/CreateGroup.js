import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, message, Form, Input } from "antd";

import Navbar from "./Navbar";
import { useUserContext } from '../hooks/useUserContext';

export default function CreateGroup() {
    const navigate = useNavigate();
    const { user } = useUserContext();

    const handleSubmit = async (values) => {
        const title = values.title;
        const description = values.description;

        const payload = {title, description};

        const response = await fetch('http://localhost:5001/api/group/create', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.userToken}`
            }
        });

        const json = await response.json();

        if (!response.ok) {
            message.error(json.message)
        }

        if (response.ok) {
            message.success(`${title} was created!`)
            navigate('/Group/' + json._id);
        }
    }

    return(
        <>
            <Navbar/>
            <div className='namePage'>
                <h1> Create Group: </h1>
            </div>
            <div className='bodyPage'>
                {!user &&
                    <div className='namePage'>
                        <h2>Sign in to Create a Group!</h2>
                    </div>
                }
                {user &&
                    <Form onFinish={handleSubmit} id='create-thread'>
                        <Form.Item name="title" rules={[{ required: true, message: "Please enter a title" }]}>
                            <Input placeholder="Title" />
                        </Form.Item>
                        <Form.Item name="description" rules={[{ required: true, message: "Please enter your group description" }]}>
                            <Input.TextArea rows={4} placeholder="Enter Description"/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Create Group
                            </Button>
                        </Form.Item>
                    </Form>
                }
            </div>
        </>
    )
}