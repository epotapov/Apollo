import { React, useState, useEffect } from 'react';

import { Collapse, Form, Input, Button, Typography, Upload, message } from "antd";
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

import { useUserContext } from '../hooks/useUserContext';

export default function UploadPdf(props) {
    const name = props.name;
    const { user } = useUserContext();
    const [ syllabi, setSyllabi ] = useState([]);
    const [ resources, setResources ] = useState([]);
    const [ isProf, setIsProf ] = useState(false);
    const [ pdfTitle, setPdfTitle ] = useState("");
    const [ resourceTitle, setResourceTitle ] = useState("");

    const onDelete = async (link, type) => {
        console.log("press")

        if (type) {
            const response = await fetch(`http://localhost:5001/api/user/delete-pdf/${name}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({link})
            })
            const json = await response.json();

            if (!response.ok) {
                message.error(`File delete failed.`);
            }
            else {
                message.success(`File was deleted.`);
            }
        }
        else {
            const response = await fetch(`http://localhost:5001/api/user/delete-pdf-resource/${name}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({link})
            })
            const json = await response.json();

            if (!response.ok) {
                message.error(`File delete failed.`);
            }
            else {
                message.success(`File was deleted.`);
            }
        }

        fetch('http://localhost:5001/api/user/get-pdf/' + name)
        .then(response => response.json())
        .then(data => {
            setSyllabi(data);
            console.log("syllabi data: " + data)
        })
        .catch(error => {
            message.error('Connection Error');
        });
        fetch('http://localhost:5001/api/user/get-pdf-resource/' + name)
        .then(response => response.json())
        .then(data => {
            setResources(data);
            console.log("resource data: " + data);
        })
        .catch(error => {
            message.error('Connection Error');
        });
    }
 
    useEffect(() => {
        if (user && !isProf) {
            fetch('http://localhost:5001/api/user/getIsProf/' + user.username)
            .then(response => response.json())
            .then(data => {
                setIsProf(data);
                console.log("prof: " + isProf)
            })
            .catch(error => {
                message.error('Connection Error');
            });
        }
	});

    useEffect(() => {
        fetch('http://localhost:5001/api/user/get-pdf/' + name)
        .then(response => response.json())
        .then(data => {
            setSyllabi(data);
            console.log("syllabi data: " + data)
        })
        .catch(error => {
            message.error('Connection Error');
        });
        fetch('http://localhost:5001/api/user/get-pdf-resource/' + name)
        .then(response => response.json())
        .then(data => {
            setResources(data);
            console.log("resource data: " + data);
        })
        .catch(error => {
            message.error('Connection Error');
        });
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
            .catch(error => {
                message.error('Connection Error');
            });
            fetch('http://localhost:5001/api/user/get-pdf-resource/' + name)
            .then(response => response.json())
            .then(data => {
                setResources(data);
                console.log("resource data: " + data);
            })
            .catch(error => {
                message.error('Connection Error');
            });
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
                        <div key={link.toString()} className='linkSelect'>
                            <a key={link.toString()} href={`http://localhost:5001/pdfs/${link[0].doc_name}`} target="_blank">{link[0].ui_name}</a>
                            {isProf && <DeleteOutlined key={link.toString()} onClick={() => onDelete(link[0].doc_name, true)}/>}
                        </div>
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
                        <div key={link.toString()} className='linkSelect'>
                            <a key={link.toString()} href={`http://localhost:5001/pdfs/${link[0].doc_name}`} target="_blank">{link[0].ui_name}</a>
                            {isProf && <DeleteOutlined key={link.toString()} onClick={() => onDelete(link[0].doc_name, false)}/>}
                        </div>
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