import { React, useState, useEffect } from "react";
import { Avatar, Button, Drawer, message, Badge, Collapse, Form, Input } from "antd";

import Navbar from "./Navbar";

export default function CreateGroup() {
    return(
        <>
            <Navbar/>
            <div className='namePage'>
                <h1> Create Group: </h1>
            </div>
            <div className='bodyPage'>
                    <div className='namePage'>
                        <h2>Cannot Create a Group! Delete your current group to make another!</h2>
                    </div>
                    <Form id='create-thread'>
                        <Form.Item name="title" rules={[{ required: true, message: "Please enter a title" }]}>
                            <Input placeholder="Title" />
                        </Form.Item>
                        <Form.Item name="content" rules={[{ required: true, message: "Please enter your group description" }]}>
                            <Input.TextArea rows={4} placeholder="Enter Description"/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Create Group
                            </Button>
                        </Form.Item>
                    </Form>  
            </div>
        </>
    )
}