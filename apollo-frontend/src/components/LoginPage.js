import { React, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';

import { Button, Checkbox, Form, Input } from 'antd';

const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

function validatePassword(value) {
    // Password must contain: at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 special character
    /*const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    var return_msg = {
        validateStatus: 'success',
        errorMsg: null,
    };
    if (pattern.test(value) == false) {
        return_msg = {
        validateStatus: 'error',
        errorMsg: 'Password must contain: at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 special character',
        };
    }
    else {
        console.log(value.length);
        return_msg = {
        validateStatus: 'success',
        errorMsg: null,
        };
        password = value;
    }
    return return_msg;*/
}

export default function LoginPage() {
    const [size, setSize] = useState('large');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [passwordObj, setPasswordObj] = useState({
        value: '',
        valid: 'error',
        errorMsg: 'Password must contain: at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 special character'
    });
    const [forgotPass, setForgotPass] = useState(false);
    const { login } = useLogin();
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState(null);


    const handleLoginSubmit = async (e) => {
        const {isLoading, error} = await login(username, password);
        setIsLoading(isLoading);
        setError(error);
        console.log(error)
        console.log(isLoading)
        if (!error) {
            navigate('/');
        }
    }


    if (!forgotPass) {
        return(
            <div className='Container'>
                <Link to='/'>
                    <Button type="primary" className="SignIn" size={size}>
                        Back
                    </Button>
                </Link>
                <Form
                    name="basic"
                    labelCol={{
                    span: 8,
                    }}
                    wrapperCol={{
                    span: 16,
                    }}
                    style={{
                    maxWidth: 600,
                    }}
                    initialValues={{
                    remember: true,
                    }}
                    onFinish={handleLoginSubmit}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <h2>Log In</h2>
                    <Form.Item
                        label="Username"
                        name="username"
                        onChange={(e) => setUsername(e.target.value)}
                        rules={[
                            {
                            required: true,
                            message: 'Please input your username!',
                            },
                        ]}
                    >
                    <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        rules={[
                            {
                            required: true,
                            message: 'Please input your password!',
                            },
                        ]}
                    >
                    <Input.Password />
                    </Form.Item>

                    <Link to='/SignUp'>
                        <h3>Sign Up</h3>
                    </Link>

                    <Link>
                        <h3 onClick={() => setForgotPass(true)}>I forgot my password</h3>
                    </Link>

                    <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                    >
                    {error && <p>{error}</p>}
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
    else {
        return (
            <div className='Container'>
                <Button type="primary" className="SignIn" onClick={() => setForgotPass(false)} size={size}>
                    Back
                </Button>
                <Form
                    name="basic"
                    labelCol={{
                    span: 8,
                    }}
                    wrapperCol={{
                    span: 16,
                    }}
                    style={{
                    maxWidth: 600,
                    }}
                    initialValues={{
                    remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <h2>Forgot My Password</h2>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                    <Input />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="newpassword"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your password!',
                            },
                        ]}
                    >
                    <Input.Password />
                    </Form.Item>

                    <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                    >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}