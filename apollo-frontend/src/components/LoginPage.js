import { React, useState} from 'react';
import { Link } from 'react-router-dom'

import { Button, Checkbox, Form, Input } from 'antd';

const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

export default function LoginPage() {
    // middleware
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
      const loginUser = {username, password}

      // ping the server
      const response = await fetch('http://localhost:5001/api/user/login', {
        method: 'POST',
        body: JSON.stringify(loginUser),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // this holds the user obj that is returned
      const returnedUser = await response.json();

      if (!response.ok) {
        setError(returnedUser.error);
      }

      if (response.ok) {
        setUsername('');
        setPassword('');
        console.log('user logged in', returnedUser);
      }
    }

//     const onUsernameChange = (value) => {
//       setUsername({ value: value });
//     };

//     const onPasswordChange = (value) => {
//       setPassword({ value: value });
//     };

    // forgot pass
    const [size, setSize] = useState('large');
    const [forgotPass, setForgotPass] = useState(false);
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
                    onFinish={handleLogin}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <h2>Log In</h2>
                    <Form.Item
                        label="Username"
                        name="username"
                        onChange{...(e) => setUsername(e.target.value)}
                        value={username}
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
                        value={password}
                        onChange{...(e) => setPassword(e.target.value)}
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
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                    <Checkbox>Remember me</Checkbox>
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
