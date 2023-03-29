import { React, useState, useEffect } from 'react';

import { Collapse, Form, Input, Button, Typography, Upload, message } from "antd";
import { UploadOutlined } from '@ant-design/icons';

import { useUserContext } from '../hooks/useUserContext';

export default function UploadPdf(props) {
    const name = props.name;
    const { user } = useUserContext();
    const [ links, setLinks ] = useState([]);
    const [ isProf, setIsProf ] = useState(false);
    const [ pdfTitle, setPdfTitle ] = useState("");
 
    useEffect(() => {
        if (user && !isProf) {
            fetch('http://localhost:5001/api/user/getIsProf/' + user.username)
            .then(response => response.json())
            .then(data => {
                setIsProf(data);
                console.log("prof: " + isProf)
            })
            console.log("prof: " + isProf)
        }
	});

    useEffect(() => {
        fetch('http://localhost:5001/api/user/get-pdf/' + name)
        .then(response => response.json())
        .then(data => {
            setLinks(data);
            console.log("data for pdf" + data)
        })
    }, [name])

    const beforeUpload = (file) => {
        console.log("file type " + file.type)
		const isPdf = file.type === "application/pdf";
		if (!isPdf) {
		  message.error('You can only upload PDF file!');
		}

		return isPdf;
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
            <div>
                {
                    links.length !== 0 &&
                    links.map((link) => <a key={link.toString()}>aaa</a>)
                }
            </div>
            {
                user && isProf &&
                <>  
                    <h2>Upload Pdf</h2>     
                    <Form name="review">
                        <Form.Item name="title" 
                            rules={[{ required: true, message: "Please enter a title" }]}
                            onChange={(e) => setPdfTitle(e.target.value)}
                        >
                            <Input placeholder="Title" />
                        </Form.Item>
                        <Form.Item
                            label="PDF File:"
                        >
                            <Upload
                                name="profilepic"
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                                showUploadList={false}
                                action={`http://localhost:5001/api/user/upload-pdf/${user.username}/${pdfTitle}`}
                            >
                                <Button icon={<UploadOutlined />} disabled type="Primary" htmlType="submit"> Upload </Button>
                            </Upload>
                        </Form.Item>
                    </Form>
                </>
            }
        </section>
    )
}