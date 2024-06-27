import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import users from './users'; 

const verificationCode = '6789';

const ForgotPasswordForm = () => {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [inputEmail, setInputEmail] = useState('');
  const [inputCode, setInputCode] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = () => {
    const user = users.find(user => user.email === inputEmail);
    if (user) {
      setIsCodeSent(true);
      message.success('Mailinize şifre iletildi.');
    } else {
      message.error('Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı.');
    }
  };

  const handleCodeSubmit = () => {
    if (inputCode === verificationCode) {
      message.success('Kod doğrulandı, giriş sayfasına yönlendiriliyorsunuz.');
      navigate('/home');
    } else {
      message.error('Yanlış kod.');
    }
  };
  const handleNavigateToLogin = () => {
    window.location.href = "/";
  };

  return (
    <Card title="Şifremi Unuttum" style={{ width: 300, margin: 'auto', marginTop: '100px' }}>
      <Form layout="vertical">
        {!isCodeSent ? (
          <>
            <Form.Item
              label="E-posta"
              name="email"
              rules={[{ required: true, message: 'Lütfen e-posta adresinizi girin!' }]}
            >
              <Input value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" style={{backgroundColor: '#9C27B0', borderColor: '#9C27B0', color: '#fff'}}onClick={handleEmailSubmit} block>
                Şifre İlet
              </Button>
            </Form.Item>
            <Form.Item>
            <Button type="default" onClick={handleNavigateToLogin} block>
                Ana Sayfa
              </Button>
            </Form.Item>
          
          </>
        ) : (
          <>
            <Form.Item
              label="Kod"
              name="code"
              rules={[{ required: true, message: 'Lütfen kodu girin!' }]}
            >
              <Input value={inputCode} onChange={(e) => setInputCode(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <Button type="primary"style={{backgroundColor: '#9C27B0', borderColor: '#9C27B0', color: '#fff'}} onClick={handleCodeSubmit} block>
                Doğrula
              </Button>
            </Form.Item>
          </>
        )}
      </Form>
    </Card>
  );
};

export default ForgotPasswordForm;
