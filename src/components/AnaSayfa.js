import React from 'react';
import { Layout } from 'antd';
import HeaderBar from './HeaderBar';

const { Content } = Layout;

const AnaSayfa = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderBar />
      <Layout>
       
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};



export default AnaSayfa;
