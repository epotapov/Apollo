import { React, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { useParams } from 'react-router-dom'
import { Button, Form, Input } from 'antd';
import { useUserContext } from '../hooks/useUserContext';

export default function ChangePass() {

  const { user } = useUserContext();
  let password = '';
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const navigate = useNavigate();
  const [passwordObj, setPassword] = useState({
    value: '',
    valid: 'error',
    errorMsg: 'Password must contain: at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 special character'
  });

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  function validatePassword(value) {
    // Password must contain: at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 special character
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;
    var return_msg = {
      validateStatus: 'success',
      errorMsg: null,
    };
    if (pattern.test(value) === false) {
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
      password = value;
    }
    return return_msg;
  }

  const handleSubmit = async (e) => {
    setConfirm(null)
    setError(null)
    const password = passwordObj.value;
    const email = user.user.email;
    const passwordInfo = {email ,password, confirmPassword};

    const response = await fetch(`http://localhost:5001/api/user/change-password`, {
      method: 'POST',
      body: JSON.stringify(passwordInfo),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      return;
    }

    if (response.ok) {
      setPassword('');
      setConfirmPassword('');
      setError(null);
      setConfirm(json)
      console.log('Password updated', json);
      fetch('http://localhost:5001/api/user/get/' + user.username)
      .then(response => response.json())
      .then(data => navigate('/Profile',{state: {user: data}}))
    }
  }

  const onPasswordChange = (value) => {
    setPassword({
      value: value,
      ...validatePassword(value)
    });
  };

  return(
    <div className='Container'>
       <Form
          name="basic"
          labelCol={{
          span: 8,
          }}
          wrapperCol={{
          span: 16,
          }}
          style={{
          width: '50%',
          }}
          initialValues={{
          remember: true,
          }}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >

        <h2>Reset Password</h2>

        <Form.Item
          label="Password"
          name="password"
          onChange={(e) => onPasswordChange(e.target.value)}
          value={passwordObj}
          validateStatus={passwordObj.validateStatus}
          help={passwordObj.errorMsg}
          rules={[
              {
                  required: true,
                  message: 'Please enter your new password!',
              },
          ]}
        >
        <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          onChange={(e) => setConfirmPassword(e.target.value)}
          rules={[
              {
                  required: true,
                  message: 'Please confirm your new password!',
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
        {error && <p>{error}</p>}
        {confirm && <p>{confirm.message}</p>}
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
