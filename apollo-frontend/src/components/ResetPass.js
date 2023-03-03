import { React, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { useParams } from 'react-router-dom'
import { Button, Form, Input } from 'antd';

export default function ResetPass() {

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const navigate = useNavigate();
  const { token } = useParams();
  console.log(token);

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleSubmit = async (e) => {
    setConfirm(null)
    setError(null)
    const passwordInfo = {password, confirmPassword};

    const response = await fetch(`http://localhost:5001/api/user/reset-password/?token=${token}`, {
      method: 'POST',
      body: JSON.stringify(passwordInfo),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await response.json();
    console.log(json)

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
      navigate('/Login');
    }
  }

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
          width: '30%',
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
          onChange={(e) => setPassword(e.target.value)}
          rules={[
              {
                  required: true,
                  message: 'Enter your new password!',
              },
          ]}
        >
        <Input />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          onChange={(e) => setConfirmPassword(e.target.value)}
          rules={[
              {
                  required: true,
                  message: 'Confirm your new password!',
              },
          ]}
        >
        <Input />
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
