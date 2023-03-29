import { React, useState, useEffect } from 'react';

import { Collapse, Form, Input, Button, Typography, Upload, message } from "antd";
import { UploadOutlined } from '@ant-design/icons';

import { useUserContext } from '../hooks/useUserContext';

export default function UploadPdf(props) {
    const name = props.name;
    const { user } = useUserContext();
    const [ links, setLinks ] = useState();
    const [ isProf, setIsProf ] = useState();
 
    useEffect(() => {
        fetch('http://localhost:5001/api/user/get-pdf/' + name)
        .then(response => response.json())
        .then(data => {
            setLinks(data);
            console.log("data for pdf" + data)
            console.log("prof: " + user)
        })
        if (user) {
            fetch('http://localhost:5001/api/user/getIsProf/' + user.username)
            .then(response => response.json())
            .then(data => {
                setIsProf(data);
                console.log("prof: " + isProf)
            })
            console.log("prof: " + user.isProf)
        }
	}, [name]);

    const beforeUpload = (file) => {
		const isPng = file.type === 'image/png';
		const isJpg = file.type === 'image/jpeg';
		if (!isPng && !isJpg) {
		  message.error('You can only upload PNG/JPEG file!');
		}

		return isPng || isJpg;
	}

	const handleChange = info => {
		if (info.file.status !== 'uploading') {
			console.log(info.file, info.fileList);
		}
		if (info.file.status === 'done') {
			message.success(`${info.file.name} file uploaded successfully`);
		} else if (info.file.status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		}
	};

    return(
        <section>
            <h2> PDFs for {name}: </h2>

            {
                user && isProf &&
                <>  
                    <h2>Upload Pdf</h2>     
                    <Form name="review">
                        <Form.Item name="title" rules={[{ required: true, message: "Please enter a title" }]}>
                            <Input placeholder="Title" />
                        </Form.Item>
                        <Form.Item
                            label="Upload Profile Picture"
                        >
                            <Upload
                                name="profilepic"
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                                showUploadList={false}
                                action={`http://localhost:5001/api/user/upload-pdf/${user.username}`}
                                headers= {{'username': username}}
                            >
                                <Button icon={<UploadOutlined />} type="Primary"> Upload </Button>
                            </Upload>
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