import {React, useState} from 'react';
import { Drawer, Form, InputNumber, Select, Button, Table, message } from 'antd';
import { useEffect } from 'react';
import { useUserContext } from '../hooks/useUserContext';
const { Option } = Select;

const CoursePairing = (course) => {
    const [visible, setVisible] = useState(false);
    const [courseData, setCourseData] = useState([]);
    const {user} = useUserContext();
    const [pairings, setPairings] = useState([]);
    const courseName = course.course;
    
    useEffect(() => {
        fetch('http://localhost:5001/api/course/getAll')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                let val = data[i].Course + ": " + data[i].Title;
                const element = {value: data[i].Course, label: val};
                setCourseData(courseData => courseData.concat(element));
            }
        })
    }, []);

    useEffect(() => {
        setPairings([]);
        fetch('http://localhost:5001/api/course/getPairings/' + courseName)
        .then(response => response.json())
        .then(data => {
            const obj = Object.entries(data);
            for (let i = 0; i < obj.length; i++) {
                const element = {course: obj[i][0], difficulty: obj[i][1], index: i};
                setPairings(pairings => pairings.concat(element));
            }
        })
    }, []);

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const onFinish = async (values) => {
        const pairing = {course: values.course, difficulty: values.difficulty, index: pairings.length};
        setPairings(pairings => pairings.concat(pairing));
        console.log(pairings);

        await fetch('http://localhost:5001/api/course/create_pairing/' + courseName, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pairing),
        })

        setVisible(false);
        message.success('Pairing added successfully\n Course: ' + values.course + '\n Difficulty: ' + values.difficulty + '\n', 3);
    };

    const coloumns = [
        {
            title: 'Course',
            dataIndex: 'course',
            key: 'course',
        },
        {
            title: 'Difficulty',
            dataIndex: 'difficulty',
            key: 'difficulty',
        },
    ];

    return (
        <div>
            { pairings.length > 0 ? (
                <Table columns={coloumns} dataSource={pairings} rowKey={(record) => record.index} pagination={false} />
            ) : (
                <p>No pairings found</p>
            )}
            {user && (
                <div>
                    <Button type="primary" onClick={showDrawer}>
                        Add Course Pair
                    </Button>
                    <Drawer
                        title="Add Course Pair"
                        placement="right"
                        closable={false}
                        onClose={onClose}
                        open={visible}
                        width={720}
                    >
                        <Form layout="vertical"  onFinish={onFinish} initialValues={{}}>
                            <Form.Item
                                name="course"
                                label="Course"
                                rules={[ { required: true, message: 'Please select a course' } ]}
                            >
                                <Select 
                                    showSearch 
                                    placeholder="Select a course" optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {courseData.map((course) => (
                                        <Option key={course.label} value={course.value}>
                                            <a target="_blank" href={"/Course/" + course.value}>{course.label}</a>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="difficulty"
                                label="Difficulty (1-10)"
                                rules={[ { required: true, message: 'Please select a difficulty' } ]}
                            >
                                <InputNumber min={1} max={10} defaultValue={1} />
                            </Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form>
                    </Drawer>
                </div>
            )}
        </div>
    )
}

export default CoursePairing;