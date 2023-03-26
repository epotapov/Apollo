import { React, useState, useEffect } from 'react';
import { useUserContext } from '../hooks/useUserContext';

import { Collapse, Form, Input, Button, Typography, Space, Rate } from "antd";
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
const { Panel } = Collapse;
const { Title } = Typography;

export default function Reviews(props) {
    const name = props.name;
    const type = props.type;
    const { user } = useUserContext();
    const [reviews, setReviews] = useState([]);
    return(
        <section>
            <h2> Reviews for {name}: </h2>
            <h1> 4/5 </h1>
            <h3> Number of Reviews: 400</h3>
            {
                reviews.length === 0 &&
                <h2>No reviews yet!</h2>
            }
            {
                reviews.length !== 0 &&
                <Collapse>
                    {reviews.map((review) => {
                        <Panel></Panel>
                    })}
                </Collapse>
            }
            {
                user && 
                <div>
                    <h3> Write a Review </h3>
                    <Form name="review">
                        <Rate className='rate' />
                        <br/>
                        <br/>
                        <Form.Item name="title" rules={[{ required: true, message: "Please enter a title" }]}>
                            <Input placeholder="Title" />
                        </Form.Item>
                        {
                            type == "course" &&
                            <>
                            <Form.Item name="professor" rules={[{ required: true, message: "Please enter a professor" }]}>
                                <Input placeholder="Professor" />
                            </Form.Item>
                            <Form.Item name="semester" rules={[{ required: true, message: "Please enter a semester" }]}>
                                <Input placeholder="Semester" />
                            </Form.Item>
                            </>
                        }
                        <Form.Item name="content" rules={[{ required: true, message: "Please enter your post content" }]}>
                            <Input.TextArea rows={4} placeholder="Post Content"/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Create Review
                            </Button>
                        </Form.Item>
                    </Form>
                    <br/>  
                </div>
            }
            {
                !user &&
                <div>
                    <h3> Please login to create a review </h3>
                </div>
            }
        </section>
    );
}