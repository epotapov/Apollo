import { React, useState} from 'react';
import { Link } from 'react-router-dom'

import { Button, Form, Radio, Input } from 'antd';


var submitStatus = false;

let email = '';
let password = '';

function validatePassword(value) {
  // Password must contain: at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 special character
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;
  var return_msg = {
    validateStatus: 'success',
    errorMsg: null,
  };
  if (pattern.test(value) === false) {
    console.log(value);
    return_msg = {
      validateStatus: 'error',
      errorMsg: 'Password must contain: at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 special character',
    };
  }
  else {
    return_msg = {
      validateStatus: 'success',
      errorMsg: null,
    };
    submitStatus = true;
    password = value;
  }
  return return_msg;
}

function validateEmail(value) {
  const pattern = value.includes("@purdue.edu")
  console.log("teype")
  var return_msg = {
    validateStatus: 'success',
    errorMsg: null,
  };
  if (!pattern) {
    return_msg = {
      validateStatus: 'error',
      errorMsg: 'Email has to be a Purdue Email',
    };
  }
  else {
    console.log(value.length);
    return_msg = {
      validateStatus: 'success',
      errorMsg: null,
    };
    submitStatus = true;
    email = value;
  }
  return return_msg;
}

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [emailObj, setEmail] = useState({
    value: '',
    valid: 'error',
    errorMsg: 'Email has to be a Purdue Email'
  });
  const [passwordObj, setPassword] = useState({
    value: '',
    valid: 'error',
    errorMsg: 'Password must contain: at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 special character'
  });
  const [role, setRole] = useState('');
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState(null)
  const [size, setSize] = useState('large');
  const [major, setMajor] = useState(null);
  const [gradYear, setGradYear] = useState(null);


  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleSubmit = async (e) => {
    setConfirm(null)
    setError(null)
    if (!submitStatus) {
      return
    }
    const user = {username, email, password, major, gradYear, role};
    console.log('hello');
    console.log(user)

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
      setMajor('');
      setGradYear('');
      setError(null);
      setConfirm(json)
      console.log('User created', json);
    }
  }

  const onPasswordChange = (value) => {
    setPassword({
      value: value,
      ...validatePassword(value)
    });
  };

  const onEmailChange = (value) => {
    setEmail({
      value: value,
      ...validateEmail(value)
    });
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
              onChange={(e) => onEmailChange(e.target.value)}
              value={emailObj}
              validateStatus={emailObj.validateStatus}
              help={emailObj.errorMsg}
              rules={[
                  {
                    required: true,
                    message: 'Please input your email!',
                  },
              ]}
          >
          <Input/>
          </Form.Item>

          <Form.Item
              label="Password"
              name="password"
              value={passwordObj}
              validateStatus={passwordObj.validateStatus}
              onChange={(e) => onPasswordChange(e.target.value)}
              help={passwordObj.errorMsg}
              rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
              ]}
          >
          <Input.Password/>
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
          {error && <p>{error}</p>}
          {confirm && <p>{confirm.message}</p>}
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          </Form.Item>
      </Form>
    </div>
  );
}
