import React, { useState } from 'react';
import { Form, Input, Button, message, Divider, Card } from 'antd';
import { GoogleOutlined, FacebookOutlined, TwitterOutlined } from '@ant-design/icons'; 
import ForgotPasswordForm from './forgotPasswordForm';
import users from './users';

const Login = () => {
  const [forgotPassword, setForgotPassword] = useState(false);

  const onFinish = (values) => {
    const user = users.find(user => user.email === values.email && user.password === values.password);
    if (user) {
      message.success('Giriş başarılı');
      localStorage.setItem('userEmail', values.email);
      window.location.href = '/home';
    } else {
      message.error('Yanlış e-posta veya şifre');
    }
  };

  const handleForgotPassword = () => {
    setForgotPassword(true);
  };

  if (forgotPassword) {
    return <ForgotPasswordForm setForgotPassword={setForgotPassword} />;
  }

  return (
    <div
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/fotog.jpeg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
    
    <Card title="Giriş Yap" style={{ width: 300, margin: 'auto', marginTop: '100px', textAlign: 'center' }}>
      <Form name="login" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="E-posta"
          name="email"
          rules={[{ required: true, message: 'Lütfen e-posta adresinizi girin!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Şifre"
          name="password"
          rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" style={{backgroundColor: '#9C27B0', borderColor: '#9C27B0', color: '#fff'}} htmlType="submit" block>
            Giriş Yap
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="link" onClick={handleForgotPassword}>
            Şifremi Unuttum
          </Button>
          <Divider style={{ borderColor: "black" }}> Devam et </Divider>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px'  }}>
          <Button 
                type="primary" 
                icon={<GoogleOutlined />} 
                onClick={() => window.location.href = 'https://myaccount.google.com'} 
                style={{ backgroundColor: "white", borderColor: "purple", color: "black" }}
                block
              >Google
               </Button>
              <Button 
                type="primary" 
                icon={<FacebookOutlined />} 
                onClick={() => window.location.href = 'https://www.facebook.com'} 
                style={{ backgroundColor: "white", borderColor: "purple", color: "black" }}
                block
              >
                Facebook 
              </Button>
              <Button 
                type="primary" 
                icon={<TwitterOutlined />} 
                onClick={() => window.location.href = 'https://x.com/i/flow/login'} 
                style={{ backgroundColor: "white", borderColor: "purple", color: "black" }}
                block
              >
                Twitter 
              </Button>
               </div>
        </Form.Item>
      </Form>
    </Card>
    </div>
  );
};

export default Login;
