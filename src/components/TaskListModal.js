import React, { useState, useEffect } from "react";
import { Modal, List, message, Button } from "antd";

const TaskListModal = ({ visible, onClose, tasks = [], selectedUser, usermail, addSubtask }) => {
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    filterTasks();
  }, [tasks, selectedUser, usermail]);

  const filterTasks = () => {
    const filtered = tasks.filter(task => 
      task.User === selectedUser ||
      task.User === usermail ||
      task.subtasks.some(subtask => 
        subtask.AltGorevSorumlu === selectedUser ||
        subtask.AltGorev1Sorumlu === selectedUser ||
        subtask.AltGorevSorumlu === usermail ||
        subtask.AltGorev1Sorumlu === usermail
      )
    );
    setFilteredTasks(filtered);
  };

  useEffect(() => {
    filterTasks();
  }, [tasks]);

  const handleListModalOk = () => {
    onClose(filteredTasks);
    message.success("Listeniz mailinize iletildi");
  };

  return (
    <Modal
      title="Görev Listesi"
      visible={visible}
      onOk={handleListModalOk}
      onCancel={() => onClose(false)}
      cancelText="İptal"
      footer={[
        <Button key="cancel" onClick={() => onClose(false)}>
          İptal
        </Button>,
        <Button key="submit" type="primary" onClick={handleListModalOk}>
          Onayla
        </Button>
      ]}
    >
      <List
        dataSource={filteredTasks}
        renderItem={(task) => {
          const subtaskDescriptions = task.subtasks.map((subtask, index) => {
            if (
              subtask.AltGorevSorumlu === selectedUser || 
              subtask.AltGorev1Sorumlu === selectedUser || 
              subtask.AltGorevSorumlu === usermail || 
              subtask.AltGorev1Sorumlu === usermail
            ) {
              return (
                <div key={index}>
                  {subtask.AltGorevSorumlu === selectedUser || subtask.AltGorevSorumlu === usermail ? (
                    <>
                      {subtask.AltGorev} - {subtask.Saat}
                      <br />
                      {subtask.StartDate} - {subtask.EndDate}
                    </>
                  ) : null}
                  {subtask.AltGorev1Sorumlu === selectedUser || subtask.AltGorev1Sorumlu === usermail ? (
                    <>
                      {subtask.AltGorev1} - {subtask.Saat1}
                      <br />
                      {subtask.AltGorev1StartDate} - {subtask.AltGorev1EndDate}
                    </>
                  ) : null}
                </div>
              );
            }
            return null;
          }).filter(Boolean);

          return (
            <List.Item>
              <List.Item.Meta
                title={`${task.StartDate} - ${task.EndDate} ${task.Gorev}`}
                description={subtaskDescriptions}
              />
            </List.Item>
          );
        }}
      />
      <p>Bu liste mailinize gönderilecek onaylıyor musunuz?</p>
    </Modal>
  );
};

export default TaskListModal;
