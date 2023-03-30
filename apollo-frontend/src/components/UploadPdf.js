import { React, useState, useEffect } from 'react';

import { Collapse, Form, Input, Button, Typography, Upload, message } from "antd";
import { UploadOutlined } from '@ant-design/icons';

import { useUserContext } from '../hooks/useUserContext';

export default function UploadPdf(props) {
    const name = props.name;
    const { user } = useUserContext();
    const [ syllabi, setSyllabi ] = useState([]);
    const [ resources, setResources ] = useState([]);
    const [ isProf, setIsProf ] = useState(false);
    const [ pdfTitle, setPdfTitle ] = useState("");
    const [ resourceTitle, setResourceTitle ] = useState("");
 
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
            setSyllabi(data);
            console.log("syllabi data: " + data)
        })
        fetch('http://localhost:5001/api/user/get-pdf-resource/' + name)
        .then(response => response.json())
        .then(data => {
            setResources(data);
            console.log("resource data: " + data);
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
            fetch('http://localhost:5001/api/user/get-pdf/' + name)
            .then(response => response.json())
            .then(data => {
                setSyllabi(data);
                console.log("syllabi data: " + data)
            })
            fetch('http://localhost:5001/api/user/get-pdf-resource/' + name)
            .then(response => response.json())
            .then(data => {
                setResources(data);
                console.log("resource data: " + data);
            })
		} else if (info.file.status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		}
	};

    return(
        <section>
            <h2> Syllabi for {name}: </h2>
            <section className='linkDirection'>
                {
                    syllabi.length !== 0 &&
                    syllabi.map((link) =>
                        <a key={link.toString()} href={`http://localhost:5001/pdfs/${link[0].doc_name}`} target="_blank">{link[0].ui_name}</a>
                    )
                }
                {
                    syllabi.length == 0 &&
                    <p>No Syllabi.</p>
                }
            </section>
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
                        <Form.Item>
                            <Upload
                                name="courseinfo"
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                                showUploadList={false}
                                action={`http://localhost:5001/api/user/upload-pdf/${name}/${pdfTitle}`}
                            >
                                <Button icon={<UploadOutlined />} type="Primary" htmlType="submit"> Upload </Button>
                            </Upload>
                        </Form.Item>
                    </Form>
                </>
            }
            <h2> Resources for {name}: </h2>
            <section className='linkDirection'>
                {
                    resources.length !== 0 &&
                    resources.map((link) =>
                        <a key={link.toString()} href={`http://localhost:5001/pdfs/${link[0].doc_name}`} target="_blank">{link[0].ui_name}</a>
                    )
                }
                {
                    resources.length == 0 &&
                    <p>No Resources.</p>
                }
            </section>
            {
                user && isProf &&
                <>  
                    <h2>Upload Resource Pdf</h2>     
                    <Form name="review">
                        <Form.Item name="title" 
                            rules={[{ required: true, message: "Please enter a title" }]}
                            onChange={(e) => setResourceTitle(e.target.value)}
                        >
                            <Input placeholder="Title" />
                        </Form.Item>
                        <Form.Item>
                            <Upload
                                name="courseinfo"
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                                showUploadList={false}
                                action={`http://localhost:5001/api/user/upload-pdf-resource/${name}/${resourceTitle}`}
                            >
                                <Button icon={<UploadOutlined />} type="Primary" htmlType="submit"> Upload </Button>
                            </Upload>
                        </Form.Item>
                    </Form>
                </>
            }
        </section>
    )
}