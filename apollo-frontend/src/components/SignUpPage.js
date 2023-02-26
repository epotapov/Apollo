import { React, useState} from 'react';
import { Link } from 'react-router-dom'

import { Button, Form, Radio, Input } from 'antd';
import Password from 'antd/es/input/Password';

function validatePassword(value) {
  // Password must contain: at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 special character
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
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
  }
  return return_msg;
}

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState({
    value: '',
    valid: 'error',
    errorMsg: 'Password must contain: at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 special character'
  });
  const [role, setRole] = useState('');
  const [error, setError] = useState(null);
  const [size, setSize] = useState('large');


  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleSubmit = async (e) => {

    const user = {username, email, password};
    console.log('hello');

    // TODO this URL will need to change eventually (once we have the server on another machine)
    const response = await fetch('http://localhost:5001/api/user/signup', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (response.ok) {
      setUsername('');
      setEmail('');
      setPassword('');
      setError(null);
      console.log('User created', json);
    }
  }

  const onPasswordChange = (value) => {
    setPassword({
      value: value,
      ...validatePassword(value)
    });
    console.log(password);
  };

  return(
    <div className='Container'>
      <Link to='/Login'>
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
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
      >
          <h2>Sign Up</h2>
          <Form.Item
              label="Username"
              name="username"
              onChange={(e) => setUsername(e.target.value)}
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
              label="Email"
              name="email"
              onChange={(e) => 
                setEmail(e.target.value)
              }
              value={email}
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
              label="Password"
              name="password"
              value={password}
              validateStatus={password.validateStatus}
              help={password.errorMsg}
              rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
              ]}
          >
          <Input.Password 
            // Log the password to console when user types
            onChange={(e) => onPasswordChange(e.target.value)}
          />
          </Form.Item>
          <Form.Item 
            label="Role"
            name="role"
            onChange={(e) => setRole(e.target.value)}
            value={role}
            rules={[
              {
                required: true,
                message: 'Please select your role!'
              },
            ]}  
          >
          <Radio.Group value={1}>
            <Radio value={1}> Student </Radio>
            <Radio value={2}> Professor </Radio>
          </Radio.Group>
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
  );
}
