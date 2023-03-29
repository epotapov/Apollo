import { React, useState, useEffect } from 'react';
import { useUserContext } from '../hooks/useUserContext';

import { Collapse, Form, Input, Button, Typography, Space, Rate } from "antd";
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
const { Panel } = Collapse;
const { Title } = Typography;

export default function UploadPdf(props) {
    const name = props.name;
    const { user } = useUserContext();
    const [ links, setLinks ] = useState();

    useEffect(() => {
        fetch('http://localhost:5001/api/get-pdf/' + name)
        .then(response => response.json())
        .then(data => {
            setLinks(data);
            console.log("data for pdf" + data)
            console.log("prof: " + user)
        })
        console.log("prof: " + user.isProf)
	}, []);

    return(
        <section>
            <h2> PDFs for {name}: </h2>

            {
                user.isProf &&
                <>  
                    <h2>Upload Pdf</h2>     
                    <Form name="review">
                        <Form.Item name="title" rules={[{ required: true, message: "Please enter a title" }]}>
                            <Input placeholder="Title" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Create Review
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            }
        </section>
    )
}