import React, { useState, useEffect } from 'react';
import { Layout, Menu, Drawer, Avatar, Button } from 'antd';
import { MenuOutlined, LogoutOutlined, UserOutlined, CalendarOutlined, ProfileOutlined,CheckCircleOutlined } from '@ant-design/icons';
import users from './users';
import TaskCalendar from './Calendar';
import Board from './Board';

const { Header } = Layout;

const HeaderBar = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('tasks');
  const [user, setUser] = useState({ email: 'user@example.com', name: 'John', surname: 'Doe', Tel: '1234567890' });
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      const foundUser = users.find(u => u.email === userEmail);
      if (foundUser) {
        setUser(foundUser);
      }
    }
  }, []);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  const renderContent = () => {
    if (selectedMenuItem === 'tasks') {
      return <Board tasks={tasks} setTasks={setTasks} />;
    } else if (selectedMenuItem === 'calendar') {
      return <TaskCalendar tasks={tasks} />;
    }
    return null;
  };

  return (
    <Layout>
      <Header style={{ backgroundColor: '#DA70D6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <MenuOutlined style={{ fontSize: '24px', color: 'white', cursor: 'pointer' }} onClick={showDrawer} />
        <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
        <CheckCircleOutlined style={{ marginLeft: '8px', color: 'white', fontSize: '24px' }} />
          <span style={{ fontFamily: 'Pacifico, cursive', color: 'white', fontSize: '32px', fontWeight: 'bold' }}>Ticky</span>
        </div>
        <Button type="link" icon={<LogoutOutlined />} onClick={handleLogout} style={{ color: 'white' }} />
      </Header>
      <Drawer
        title="Kullanıcı Bilgileri"
        placement="left"
        closable={true}
        onClose={closeDrawer}
        visible={drawerVisible}
      >
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <Avatar size={64} icon={<UserOutlined />} />
          <div style={{ marginTop: '8px' }}>
            <p><strong>Ad:</strong> {user.name}</p>
            <p><strong>Soyad:</strong> {user.surname}</p>
            <p><strong>E-posta:</strong> {user.email}</p>
            <p><strong>Telefon:</strong> {user.Tel}</p>
          </div>
        </div>
        <Menu mode="inline" defaultSelectedKeys={['tasks']} style={{ height: '100%' }}>
          <Menu.Item key="tasks" icon={<ProfileOutlined />} onClick={() => setSelectedMenuItem('tasks')}>
            Görevlerim
          </Menu.Item>
          <Menu.Item key="calendar" icon={<CalendarOutlined />} onClick={() => setSelectedMenuItem('calendar')}>
            Takvim
          </Menu.Item>
        </Menu>
      </Drawer>
      <div style={{ padding: '16px' }}>
        {renderContent()}
      </div>
    </Layout>
  );
};

export default HeaderBar;
