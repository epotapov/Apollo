import { React, useState, useEffect } from 'react';
import { useUserContext } from '../hooks/useUserContext';
import { Collapse, Form, Input, Button, Space, Rate, InputNumber, Avatar, message, Checkbox, Modal } from "antd";
import { LikeOutlined, DislikeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import defpfp from '../img/defaultpfp.png';

const { Panel } = Collapse;

export default function Reviews(props) {
    const name = props.name;
    const { user } = useUserContext();
    const [reviews, setReviews] = useState([]);
    const [averageReview, setAverageReview] = useState(0);
    const [rating, setRating] = useState(0);
    const [attendance, setAttendance] = useState(false);
    const [writeReviewEnabled, setWriteReviewEnabled] = useState(false);
    const [reviewForm] = useForm();
    const [filterReviewAmount, setFilterReviewAmount] = useState(1);

    //modal stuff for delete
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Are you sure you want to delete this review?');
    const [deletedReview, setDeletedReview] = useState("");

    //edit review stuff
    const [openEdit, setOpenEdit] = useState(false);
    const [confirmLoadingEdit, setConfirmLoadingEdit] = useState(false);
    const [editForm] = Form.useForm();
    const [ReviewId, setReviewId] = useState("");
    const [editStars, setEditStars] = useState(0);
    const [editAttendanceRequired, setEditAttendanceRequired] = useState(false);
    const [formData, setFormData] = useState({title: "", professor: "", semester: "",
                    difficulty: 0, enjoyability: 0, description: ""})

    const showModal = () => {
        setModalText('Are you sure you want to delete this review?')
        setOpen(true);
    };

    const handleOk = () => {
        setModalText('Deleting Review...');
        setConfirmLoading(true);
        handleDelete(deletedReview);
        setOpen(false);
        setConfirmLoading(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const showEditModal = () => {
        setOpenEdit(true);
    };

    const handleEditOk = () => {
        setConfirmLoadingEdit(true);
        handleEditReview();
        setOpenEdit(false);
        setConfirmLoadingEdit(false);
    };

    const handleEditCancel = () => {
        editForm.resetFields();
        setOpenEdit(false);
    };

    useEffect(() => {
        if (name.length !== 0) {
            const fetchReviews = async () => {
                let path = `http://localhost:5001/api/ratings/${name}`
                fetch(path)
                .then(response => response.json())
                .then(data => {
                    formatReviews(data);
                })
                .catch(error => {
                    message.error('Connection Error');
                });
                fetch("http://localhost:5001/api/ratings/" + name + "/avgRating")
                .then(response => response.json())
                .then(data => {
                    setAverageReview(data);
                })
                .catch(error => {
                    message.error('Connection Error');
                });  
            };

            fetchReviews();
        }
    }, [name]);


    const formatReviews = (data) => {
        setReviews([]);
        for (let i = 0; i < data.length; i++) {
            const _id = data[i]._id;
            const title = data[i].title;
            const semester = data[i].semester;
            const professor = data[i].professor;
            const stars = data[i].stars;
            const description = data[i].description;
            const difficulty = data[i].difficulty;
            const enjoyability = data[i].enjoyability;
            const attendanceRequired = data[i].attendanceRequired;
            const upvotes = data[i].upvotes;
            const downvotes = data[i].downvotes;
            const username = data[i].username;
            const pfp = data[i].userPfp;
            if (user && username === user.username) 
                setWriteReviewEnabled(true)
            const review = {
                id: _id,
                title: title,
                semester: semester,
                professor: professor,
                stars: stars,
                description: description,
                difficulty: difficulty,
                enjoyability: enjoyability,
                attendanceRequired: attendanceRequired,
                upvotes : upvotes ? Object.entries(upvotes).length : 0,
                downvotes: downvotes ? Object.entries(downvotes).length : 0,
                username: username,
                userPfp: pfp
            }
            setFormData({title: review.title, professor: review.professor, semester: review.semester,
                difficulty: review.difficulty, enjoyability: review.enjoyability, 
                description: review.description});
            setEditStars(review.stars);
            setEditAttendanceRequired(review.attendanceRequired);
            setReviews(reviews => [...reviews, review]);
        }
    }

    const handleCreateReview = async (values) => {
        const review = {
            title: values.title,
            semester: values.semester,
            professor: values.professor,
            stars: values.stars,
            coursename: name,
            stars: rating,
            description: values.description,
            difficulty: values.difficulty,
            enjoyability: values.enjoyability,
            attendanceRequired: attendance,
            username: user.username,
            userPfp: user.user.profilePicture
        }
    
        const response = await fetch('http://localhost:5001/api/ratings/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(review)
        })

        if (!response.ok) {
            message.error(`Create review failed.`);
            return;
        }

        let path = `http://localhost:5001/api/ratings/${name}`
        fetch("http://localhost:5001/api/ratings/" + name + "/avgRating")
        .then(response => response.json())
        .then(data => {
            setAverageReview(data);
        })
        .catch(error => {
            message.error('Connection Error');
        });

        const data = await response.json();
        formatReviews(data);
        reviewForm.resetFields();
    }

    const handleUpVote = async (reviewId) => {
        if (!user) {
            alert("Please login to upvote");
            return;
        }
        const response = await fetch(`http://localhost:5001/api/ratings/${reviewId}/upvote`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: user.username})
        })
        .catch(error => {
            message.error('Connection Error');
        });

        if (!response.ok) {
            return;
        }
        
        const reviewIndex = reviews.findIndex((review) => review.id === reviewId);
        const review = reviews[reviewIndex];

        let updatedReview = {}; 
      
        if (response.status === 209) {
            updatedReview = {
            ...review,
            upvotes: review.upvotes - 1,
            };
        }
        else if (response.status === 210) {
            updatedReview = {
            ...review,
            upvotes: review.upvotes + 1,
            downvotes: review.downvotes - 1
            };
        }
        else {
            updatedReview = {
            ...review,
            upvotes: review.upvotes + 1,
            };
        }
      
        const updatedReviews = [
          ...reviews.slice(0, reviewIndex),
          updatedReview,
          ...reviews.slice(reviewIndex + 1),
        ];

        setReviews(updatedReviews);
    }

    const handleDownVote = async (reviewId) => {
        if (!user) {
            alert("Please login to downvote");
            return;
        }
        const response = await fetch(`http://localhost:5001/api/ratings/${reviewId}/downvote`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: user.username})
        })
        .catch(error => {
            message.error('Connection Error');
        });

        if (!response.ok) {
            return;
        }

        const reviewIndex = reviews.findIndex((review) => review.id === reviewId);
        const review = reviews[reviewIndex];
      
        let updatedReview = {};
        if (response.status === 209) {
            updatedReview = {
            ...review,
            downvotes: review.downvotes - 1,
            };
        }
        else if (response.status === 210) {
            updatedReview = {
            ...review,
            downvotes: review.downvotes + 1,
            upvotes: review.upvotes - 1
            };
        }
        else {
            updatedReview = {
            ...review,
            downvotes: review.downvotes + 1,
            };
        }
      
        const updatedReviews = [    
          ...reviews.slice(0, reviewIndex),
          updatedReview,
          ...reviews.slice(reviewIndex + 1),
        ];

        setReviews(updatedReviews);
    }

    const handleDelete = async (reviewId) => {
        const response = await fetch(`http://localhost:5001/api/ratings/${reviewId}/deleteReview`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: user.username})
        })

        if (!response.ok) {
            message.error(`Review delete failed.`);
            return;
        }
        let path = `http://localhost:5001/api/ratings/${name}`
        fetch(path)
        .then(response => response.json())
        .then(data => {
            formatReviews(data);
        })
        .catch(error => {
            message.error('Connection Error');
        });
        fetch("http://localhost:5001/api/ratings/" + name + "/avgRating")
        .then(response => response.json())
        .then(data => {
            setAverageReview(data);
        })
        .catch(error => {
            message.error('Connection Error');
        });
        message.success("Review was deleted");
        setWriteReviewEnabled(false);
    }

    const handleEditReview = async () => {
        const payload = {...formData, attendanceRequired: editAttendanceRequired, stars: editStars}
        const response = await fetch(`http://localhost:5001/api/ratings/${ReviewId}/editReview`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const json = await response.json();

        if (!response.ok) {
            editForm.resetFields();
            setEditStars(editAttendanceRequired);
            setEditAttendanceRequired(editStars);
            message.error(json.message)
        }

        if (response.ok) {
            message.success(`You edited your review!`);
            let path = `http://localhost:5001/api/ratings/${name}`
            fetch(path)
            .then(response => response.json())
            .then(data => {
                formatReviews(data);
            })
            .catch(error => {
                message.error(error.message);
            });
            fetch("http://localhost:5001/api/ratings/" + name + "/avgRating")
            .then(response => response.json())
            .then(data => {
                setAverageReview(data);
            })
            .catch(error => {
                message.error('Connection Error');
            });
        }
    }

    const handleReviewFilterChange = (value) => {
        setFilterReviewAmount(value);    
    }

    return(
        <section>
            <h2> Reviews for {name}: </h2>
            <h1> {averageReview ? averageReview.toFixed(2) : ''}/5 </h1>
            <h3> Number of Reviews: {reviews.length}</h3>
            { reviews.length > 0 && (
                <>
                    <div>
                        <h3> Filter by number of stars: </h3>
                        <InputNumber min={1} max={5} defaultValue={filterReviewAmount}
                            onChange={(e) => handleReviewFilterChange(e)} />
                    </div>
                    <br/>
                </>
            )}
            {
                reviews.length === 0 &&
                <h2>No reviews yet!</h2>
            }
            {
                reviews.length !== 0 &&
                <Collapse collapsible='icon'>
                    {reviews.map((review) => (
                        review.stars == filterReviewAmount &&
                            <Panel
                                header={
                                    <Space>
                                        <Avatar 
                                            src={review.userPfp !== "default" ? `http://localhost:5001/pictures/${review.userPfp}` : defpfp } 
                                            onClick={() => {window.open(`/Profile/${review.username}`);}}
                                        />
                                        <a target="_blank" href={`/Profile/${review.username}`}> {review.username}: </a>
                                        <span> {review.title} </span> 
                                        <span>
                                            <Button shape="Circle" icon={<LikeOutlined />} onClick={() => handleUpVote(review.id)} />
                                            {review.upvotes}
                                        </span>
                                        <span>
                                            <Button shape="Circle" icon={<DislikeOutlined />} onClick={() => handleDownVote(review.id)} />
                                            {review.downvotes}
                                        </span>
                                        {
                                            user && user.username == review.username &&
                                            <>
                                                <span>
                                                    <Button shape="Circle" icon={<DeleteOutlined />} onClick={() => {
                                                        showModal();
                                                        setDeletedReview(review.id);
                                                    }} />
                                                    <Modal
                                                        title="Deleting Review"
                                                        open={open}
                                                        onOk={handleOk}
                                                        confirmLoading={confirmLoading}
                                                        onCancel={handleCancel}
                                                    >
                                                        <p>{modalText}</p>
                                                    </Modal>
                                                </span>
                                                <span>
                                                    <Button shape="Circle" icon={<EditOutlined />} onClick={() => {
                                                        showEditModal();
                                                        setEditStars(review.stars);
                                                        setEditAttendanceRequired(review.attendanceRequired);
                                                        setReviewId(review.id);
                                                    }} />
                                                    <Modal
                                                        title="Edit review"
                                                        open={openEdit}
                                                        onOk={handleEditOk}
                                                        confirmLoading={confirmLoadingEdit}
                                                        onCancel={handleEditCancel}
                                                    >
                                                        <Form form={editForm} initialValues={{title: review.title, professor: review.professor, semester: review.semester,
                                                                                             difficulty: review.difficulty, enjoyability: review.enjoyability, attendanceRequired: review.attendanceRequired,
                                                                                             description: review.description}} name="editReview">
                                                            <Rate name="stars" value={editStars} onChange={(value) => {setEditStars(value)}} className='rate' rules={[{ required: true, message: "Please enter a Rating" }]}/>
                                                            <br/>
                                                            <br/>
                                                            <Form.Item name="title" rules={[{ required: true, message: "Please enter a title" }]}>
                                                                <Input placeholder="Title" onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                                                            </Form.Item>
                                                            <Form.Item name="professor" rules={[{ required: true, message: "Please enter a professor" }]}>
                                                                <Input placeholder="Professor" onChange={(e) => setFormData({ ...formData, professor: e.target.value })} />
                                                            </Form.Item>
                                                            <Form.Item name="semester" rules={[{ required: true, message: "Please enter a semester" }]}>
                                                                <Input placeholder="Semester"  onChange={(e) => setFormData({ ...formData, semester: e.target.value })} />
                                                            </Form.Item>
                                                            <Form.Item label="Difficulty" name="difficulty" rules={[{ required: true, message: "Please enter a difficulty" }]}>
                                                                <InputNumber min={1} max={5} onChange={(e) => setFormData({ ...formData, difficulty: e})}/> 
                                                            </Form.Item>
                                                            <Form.Item label="Enjoyablility" name="enjoyability" rules={[{ required: true, message: "Please enter a enjoyability" }]}>
                                                                <InputNumber min={1} max={5} onChange={(e) => setFormData({ ...formData, enjoyability: e})}/> 
                                                            </Form.Item>
                                                            <Form.Item name="attendanceRequired">
                                                                <Checkbox checked={editAttendanceRequired} onChange={(e) => setEditAttendanceRequired(e.target.checked)}>Attendance Required</Checkbox>
                                                            </Form.Item>
                                                            <Form.Item name="description" rules={[{ required: true, message: "Please enter your post description" }]}>
                                                                <Input.TextArea rows={4} placeholder="Post Description" onChange={(e) => setFormData({ ...formData, description: e.target.value })}/>
                                                            </Form.Item>
                                                        </Form>
                                                    </Modal>
                                                </span>
                                            </>
                                        }
                                    </Space>
                                }
                                key={review.id}
                            >
                                <h3>{review.stars}/5</h3>    
                                <h3>Semester: {review.semester}</h3>
                                <h3>Professor: {review.professor}</h3>
                                <h3>Difficulty: {review.difficulty}/5</h3>
                                <h3>Enjoyability: {review.enjoyability}/5</h3>
                                <h3>Attendance Required: {review.attendanceRequired ? <>yes</> : <>no</>}</h3>
                                <p> {review.description} </p> 
                            </Panel>
                    ))}
                </Collapse>
            }
            {
                user && 
                <div>
                    <h3> Write a Review </h3>
                    <Form form={reviewForm} name="review" onFinish={(values) => handleCreateReview(values)}>
                        <Rate name="stars" onChange={(value) => {setRating(value)}} className='rate' rules={[{ required: true, message: "Please enter a Rating" }]}/>
                        <br/>
                        <br/>
                        <Form.Item name="title" rules={[{ required: true, message: "Please enter a title" }]}>
                            <Input placeholder="Title" />
                        </Form.Item>
                        <Form.Item name="professor" rules={[{ required: true, message: "Please enter a professor" }]}>
                            <Input placeholder="Professor" />
                        </Form.Item>
                        <Form.Item name="semester" rules={[{ required: true, message: "Please enter a semester" }]}>
                            <Input placeholder="Semester" />
                        </Form.Item>
                        <Form.Item label="Difficulty" name="difficulty" rules={[{ required: true, message: "Please enter a difficulty" }]}>
                            <InputNumber min={1} max={5}/> 
                        </Form.Item>
                        <Form.Item label="Enjoyablility" name="enjoyability" rules={[{ required: true, message: "Please enter a enjoyability" }]}>
                            <InputNumber min={1} max={5}/> 
                        </Form.Item>
                        <Form.Item name="attendanceRequired">
                            <Checkbox onChange={() => setAttendance(!attendance)}>Attendance Required</Checkbox>
                        </Form.Item>
                        <Form.Item name="description" rules={[{ required: true, message: "Please enter your post description" }]}>
                            <Input.TextArea rows={4} placeholder="Post Description"/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" disabled={writeReviewEnabled}>
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