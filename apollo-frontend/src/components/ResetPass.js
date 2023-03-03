import { React, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

import { Button, Form, Input } from 'antd';

export default function ResetPass() {

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState(null);

  return  (
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
          // onFinish={handleResetSubmit}
          // onFinishFailed={onFinishFailed}
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
