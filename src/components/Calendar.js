import React, { useEffect, useState } from 'react';
import { Calendar, Tabs, Typography, Tooltip, Badge, Row, Col, Timeline, Table } from 'antd';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/tr';

const { TabPane } = Tabs;
const { Text } = Typography;

moment.locale('tr');

const CustomCalendar = () => {
  const [data, setData] = useState([]);
  const usermail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://v1.nocodeapi.com/dnjdjdjd/google_sheets/TNxidJkoNPxfCNGz?tabId=Sayfa1');  
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const filterTasks = (data) => {
    return data.filter(item =>
      item.AltGorevSorumlusu === usermail || item.AltGorev1Sorumlu === usermail
    );
  };

  const isDateInRange = (date, GStartDate, GEndDate) => {
    const d = moment(date, 'DD.MM.YYYY');
    const start = moment(GStartDate, 'DD.MM.YYYY');
    const end = moment(GEndDate, 'DD.MM.YYYY');
    return d.isBetween(start, end, undefined, '[]'); 
  };

  const getDayOfWeek = (dateString) => {
    const [day, month, year] = dateString.split('.');
    const date = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD');
    return date.format('dddd'); 
  };

  const renderSchedule = (tasks) => {
    const columns = [
      {
        title: 'Görev',
        dataIndex: 'Gorev',
        key: 'Gorev',
        render: (text) => <Text strong>{text}</Text>
      },
      {
        title: 'Alt Görev',
        dataIndex: 'AltGorev',
        key: 'AltGorev',
        render: (text, record) => (
          <Text type="secondary">
            {record.AltGorevSorumlusu === usermail ? record.AltGorev : (record.AltGorev1 || '')}
          </Text>
        )
      },
      {
        title: 'Başlangıç Tarihi',
        dataIndex: 'StartDate',
        key: 'StartDate',
        render: (text) => (
          <>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary">{getDayOfWeek(text)}</Text>
          </>
        )
      },
      {
        title: 'Bitiş Tarihi',
        dataIndex: 'EndDate',
        key: 'EndDate',
        render: (text) => (
          <>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary">{getDayOfWeek(text)}</Text>
          </>
        )
      },
      {
        title: 'Saat',
        dataIndex: 'Saat',
        key: 'Saat',
        render: (text, record) => (
          <Text type="secondary">
            {record.AltGorevSorumlusu === usermail ? record.Saat : (record.Saat1 || '')}
          </Text>
        )
      }
    ];

    const formattedTasks = tasks.map(task => ({
      ...task,
      Saat: task.AltGorevSorumlusu === usermail ? task.Saat : (task.Saat1 || ''),
      AltGorev: task.AltGorevSorumlusu === usermail ? task.AltGorev : (task.AltGorev1 || '')
    }));

    return <Table dataSource={formattedTasks} columns={columns} pagination={false} />;
  };

  const renderTimeline = (tasks) => {
    return (
      <Timeline mode="right" style={{ padding: '0 16px' }}>
        {tasks.map(task => (
          <Timeline.Item key={task.Gorev} label={<Text>{task.StartDate} - {task.EndDate}</Text>}>
            <Text strong>{task.Gorev}</Text>
            <br />
            <Text type="secondary">
              {task.AltGorevSorumlusu === usermail ? task.AltGorev : (task.AltGorev1 || '')}
            </Text>
          </Timeline.Item>
        ))}
      </Timeline>
    );
  };

  const dateCellRender = (value) => {
    const formattedDate = value.format('DD.MM.YYYY');
    const tasksForDate = filteredTasks.filter(task => {
      return (
        (task.AltGorevSorumlusu === usermail && isDateInRange(formattedDate, task.StartDate, task.EndDate)) ||
        (task.AltGorev1Sorumlu === usermail && isDateInRange(formattedDate, task.StartDate, task.EndDate))
      );
    });

    return (
      <ul className="events">
        {tasksForDate.map(task => (
          <li key={task.Gorev}>
            <Tooltip title={`Görev: ${task.Gorev}, Alt Görev: ${task.AltGorevSorumlusu === usermail ? task.AltGorev : (task.AltGorev1 || '')}, Saat: ${task.AltGorevSorumlusu === usermail ? task.Saat : (task.Saat1 || '')}`}>
              <Badge status="success" text={`${task.Gorev} - ${task.AltGorevSorumlusu === usermail ? task.AltGorev : (task.AltGorev1 || '')} - ${task.AltGorevSorumlusu === usermail ? task.Saat : (task.Saat1 || '')}`} />
            </Tooltip>
          </li>
        ))}
      </ul>
    );
  };

  const filteredTasks = filterTasks(data);

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Takvim" key="1">
        <Calendar dateCellRender={dateCellRender} />
      </TabPane>
      <TabPane tab="Çizelge" key="2">
        <Row gutter={[90,90]}>
          <Col span={16} style={{ paddingRight: '16px' }}>
            {renderSchedule(filteredTasks)}
          </Col>
          <Col span={8} style={{ paddingLeft: '16px' }}>
            {renderTimeline(filteredTasks)}
          </Col>
        </Row>
      </TabPane>
    </Tabs>
  );
};

export default CustomCalendar;
