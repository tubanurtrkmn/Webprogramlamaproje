import React, { useState, useEffect } from "react";
import { Button, Input, Modal, message, Checkbox ,} from "antd";
import { ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import axios from "axios";
import users from "./users";
import TaskListModal from "./TaskListModal";


const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskDate, setNewTaskDate] = useState("");
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [responsibleEmail, setResponsibleEmail] = useState("");
  const [showSubtaskModal, setShowSubtaskModal] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [subtaskTime, setSubtaskTime] = useState("");
  const [subtaskUser, setSubtaskUser] = useState("");
  const [subtaskStartDate, setSubtaskStartDate] = useState("");
  const [subtaskEndDate, setSubtaskEndDate] = useState("");
  const [taskStartDate, setTaskStartDate] = useState("");
  const [taskEndDate, setTaskEndDate] = useState("");


  
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setSelectedUser(email);
      getData(email);
    }
  }, []);

  const getData = (value) => {
    setIsLoading(true);
    axios({
      method: "get",
      url: "https://v1.nocodeapi.com/dnjdjdjd/google_sheets/TNxidJkoNPxfCNGz?tabId=Sayfa1",
    }).then(function (response) {
      setIsLoading(false);
      const data = response.data.data;
      
      const userTasks = data.filter(
        (d) =>
          (d.AltGorevSorumlu?.includes(value) || false) ||
          (d.AltGorev1Sorumlu?.includes(value) || false)
      );
      
      const taskList = userTasks.map((task) => {
        const subtasks = data.filter((d) => d.Gorev === task.Gorev);
        return {
          ...task,
          subtasks: subtasks.map((sub) => ({
            ...sub,
            completed: false,
            completed1: false,
            completed2:false,
          })),
        };
      });
      setTasks(taskList);
    });
  };
  

  const handleAddTask = () => {
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  
  const handleCancel = () => {
    setShowModal(false);
    setNewTask("");
    setResponsibleEmail("");
  };
  const handleStartDateChange = (e) => {
    setTaskStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setTaskEndDate(e.target.value);
  };


  const handleAdd = () => {
    if (!newTask) {
      message.error("Görev adı boş olamaz!");
      return;
    }

    const newTaskObj = {
      Gorev: newTask,
      GStartDate: taskStartDate,
      GEndDate: taskEndDate,
      AltGorev: "",
      StartDate: "",
      EndDate: "",
      Saat: "",
      AltGorevSorumlu: "",
      AltGorev1: "",
      AltGorev1StartDate: "",
      AltGorev1EndDate: "",
      Saat1: "",
      AltGorev1Sorumlu: "",
      completed: false,
      subtasks: [],
    };
      setTasks([...tasks, newTaskObj]);
      setNewTask("");
      setTaskStartDate("");
      setTaskEndDate("");
      setResponsibleEmail("");
      setShowModal(false);
    };
    

  const handleAddSubtask = (task) => {
    setTaskToEdit(task);
    setShowSubtaskModal(true);
  };

  const handleSubtaskInputChange = (e) => {
    setNewSubtask(e.target.value);
  };

  const handleSubtaskTimeChange = (e) => {
    setSubtaskTime(e.target.value);
  };
  const handleSubtaskStartDateChange = (e) => {
    setSubtaskStartDate(e.target.value);
  };

  const handleSubtaskEndDateChange = (e) => {
    setSubtaskEndDate(e.target.value);
  };
  const handleSubtaskCancel = () => {
    setShowSubtaskModal(false);
    setNewSubtask("");
    setSubtaskTime("");
    setSubtaskUser("");
    setSubtaskStartDate("");
    setSubtaskEndDate("");
  };
  const convertToDate = (dateString) => {
    const [day, month, year] = dateString.split(".");
    return new Date(`${year}-${month}-${day}`);
  };

  const handleSubtaskAdd = () => {
    if (!newSubtask) {
      message.error("Alt görev adı boş olamaz!");
      return;
    }
    if (!subtaskUser) {
      message.error("Sorumlu kullanıcı adı boş olamaz!");
      return;
    }
    const isValidUser = users.some(users => users.email === subtaskUser);

    if (!isValidUser) {
      message.error("Geçersiz e-posta adresi!");
      return;
    }
    const taskStartDate = convertToDate(taskToEdit.GStartDate);
    const taskEndDate = convertToDate(taskToEdit.GEndDate);
    const subStartDate = convertToDate(subtaskStartDate);
    const subEndDate = convertToDate(subtaskEndDate);


  if (subStartDate < taskStartDate || subEndDate > taskEndDate) {
    message.error("Alt görev tarihleri görev tarihleri aralığında olmalıdır!");
    return;
  }

    const newSubtaskObj = {
      Gorev: taskToEdit.Gorev,
      AltGorev: newSubtask,
      StartDate: subtaskStartDate,
      EndDate: subtaskEndDate,
      Saat: subtaskTime,
      AltGorevSorumlu: subtaskUser,
      completed: false,
      AltGorev1: "",
      AltGorev1StartDate: "",
      AltGorev1EndDate: "",
      Saat1: "",
      AltGorev1Sorumlu: ""
    };
    const updatedTasks = tasks.map((task) => {
      if (task.Gorev === taskToEdit.Gorev) {
        return { ...task, subtasks: [...task.subtasks, newSubtaskObj] };
      }
      return task;
    });

    setIsLoading(true);
    axios({
      method: "post",
      url: "https://v1.nocodeapi.com/dnjdjdjd/google_sheets/TNxidJkoNPxfCNGz?tabId=Sayfa1",
      data: [
        [
          taskToEdit.Gorev,
          taskToEdit.GStartDate,
          taskToEdit.GEndDate,
          newSubtask,
          subtaskStartDate,
          subtaskEndDate,
          subtaskTime,
          subtaskUser,
          "",
          "",
          "",
          "",
          ""
        ]
      ],
    })
    .then(() => {
      setIsLoading(false);
      const updatedTasks = tasks.map((task) => {
        if (task.Gorev === taskToEdit.Gorev) {
          return { ...task, subtasks: [...task.subtasks, newSubtaskObj] };
        }
        return task;
      });
      setTasks(updatedTasks);
      setNewSubtask("");
      setSubtaskTime("");
      setSubtaskUser("");
      setSubtaskStartDate("");
      setSubtaskEndDate("");
      setShowSubtaskModal(false);
      message.success("Alt görev başarıyla eklendi!");
    })
    .catch(() => {
      setIsLoading(false);
      message.error("Alt görev eklenirken bir hata oluştu!");
    });
  };
  const handleSubtaskCompletion = (task, subtask, subtaskIndex, isSubtask1 = false) => {
    const updatedTasks = tasks.map((t) => {
      if (t.Gorev === task.Gorev) {
        const updatedSubtasks = t.subtasks.map((st, index) => {
          if (index === subtaskIndex) {
            if (isSubtask1) {
              return { ...st, completed1: !st.completed1 };
            } else {
              return { ...st, completed: !st.completed };
            }
          }
          return st;
        });
        return { ...t, subtasks: updatedSubtasks };
      }
      return t;
    });
  
    setTasks(updatedTasks);
  
    const requestData = [
      task.Gorev,
      task.GStartDate,
      task.GEndDate,
      subtask.AltGorev,
      subtask.StartDate,
      subtask.EndDate,
      subtask.Saat,
      subtask.AltGorevSorumlu,
      subtask.AltGorev1,
      subtask.AltGorev1StartDate,
      subtask.AltGorev1EndDate,
      subtask.Saat1,
      subtask.AltGorev1Sorumlu,
      updatedTasks.find(t => t.Gorev === task.Gorev).subtasks[subtaskIndex].completed && updatedTasks.find(t => t.Gorev === task.Gorev).subtasks[subtaskIndex].completed1 ? "Completed" : "Incomplete",
  ];
  
    axios.post('https://v1.nocodeapi.com/dnjdjdjd/google_sheets/TNxidJkoNPxfCNGz?tabId=Sayfa1', {
      data: [requestData]
    })
    .catch(error => {
      console.error("There was an error updating the task:", error);
    });
  };

    const canCompleteTask = (task) => {
      return task.subtasks.every(subtask => subtask.completed && (!subtask.AltGorev1 || subtask.completed1));
};

  const handleTaskCompletion = (task) => {
    if (canCompleteTask(task)) {
        setCompletedTasks([...completedTasks, { ...task, completed: true }]);
        setTasks(tasks.filter((item) => item !== task));
    } else {
        message.error("Tüm alt görevler tamamlanmadan bu görev tamamlanamaz!");
    }
};

  const handleTaskDeletion = (taskToDelete) => {
    setTasks(tasks.filter((task) => task !== taskToDelete));
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    handleTaskDeletion(taskToDelete);
  };

  const handleListTasks = () => {
    const email = localStorage.getItem("userEmail");
    setShowListModal(true);
  };
  

  const handleListModalOk = () => {
    setShowListModal(false);
    message.success("Listeniz mailinize iletildi");
  };
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "45%" }}>
        
        <h2>Yapılacaklar</h2>
        
        <div style={{ minHeight: "400px" }}>
          {tasks.map((task, index) => (
            <div
              key={task.Gorev}
              style={{
                userSelect: "none",
                padding: "16px",
                margin: "0 0 8px 0",
                minHeight: "50px",
                backgroundColor: "lightgrey",
                borderRadius: "4px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ marginBottom: "8px", display: "flex", flexDirection: "column" }}>
              <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
              {task.GStartDate} -{task.GEndDate}</div>
                <div style={{ marginBottom: "8px", fontWeight: "bold" }}>  
                {task.Gorev}
                </div>
              </div>
              <div style={{ marginBottom: "8px" }}>
                {task.subtasks.map((subtask, subIndex) => (
                  <div key={subIndex} style={{ display: "flex", flexDirection: "column", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Checkbox
                        checked={subtask.completed}
                        onChange={() => handleSubtaskCompletion(task, subtask,subIndex)}
                      >
                        {subtask.AltGorev}
                      </Checkbox>
                      {subtask.Saat && (
                        <span style={{ marginLeft: "8px" , color:"gray"}}>
                           <ClockCircleOutlined style={{ marginRight: "4px" }} />
                          {subtask.Saat}
                          <div>
                          <CalendarOutlined style={{ marginRight: "4px" }} />
                           {subtask.StartDate}-{subtask.EndDate} 
                          </div>
                        </span>
                      )}
                      {subtask.AltGorevSorumlu && (
                        <Button
                          type="primary"
                          style={{ marginLeft: "auto", background: "linear-gradient(45deg, #9C27B0 0%, #E040FB 100%)", color: "white" }}
                        >
                          {subtask.AltGorevSorumlu}
                         
                        </Button>
                      )}
                    </div>
                    {subtask.AltGorev1 && (
                      <div style={{ display: "flex", alignItems: "center", marginTop: "4px" }}>
                        <Checkbox
                          checked={subtask.completed1}
                          onChange={() => handleSubtaskCompletion(task, subtask,subIndex, true)}
                        >
                          {subtask.AltGorev1}
                        </Checkbox>
                        {subtask.Saat1 && (
                          <span style={{ marginLeft: "8px",color:"gray"}}>
                             <ClockCircleOutlined style={{ marginRight: "4px" }} />
                            {subtask.Saat1}
                            <div> 
                            <CalendarOutlined style={{ marginRight: "4px" }} />
                              {subtask.AltGorev1StartDate}-{subtask.AltGorev1EndDate} </div>
                          </span>
                        )}
                        {subtask.AltGorev1Sorumlu && (
                          <Button
                            type="primary"
                            style={{ marginLeft: "auto", background: "linear-gradient(45deg, #9C27B0 0%, #E040FB 100%)", color: "white" }}
                          >
                            {subtask.AltGorev1Sorumlu}
                            
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div style={{ marginRight: "auto", display: "flex", justifyContent: "flex-end", gap: "8px",color:"lavender" }}>
                <Button type="primary" onClick={() => handleAddSubtask(task)}>
                  Alt Görev Ekle
                </Button>
                <Button
                  type="default"
                  onClick={() => {
                    setShowDeleteModal(true);
                    setTaskToDelete(task);
                  }}
                >
                  Sil
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleTaskCompletion(task)}
                  disabled={!canCompleteTask(task)}
                >
                  Tamamla
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          type="primary"
          onClick={handleAddTask}
          style={{ marginBottom: "16px" }}
        >
          Görev Ekle
        </Button>
        <Button
          type="default"
          onClick={handleListTasks}
          style={{ marginBottom: "16px", marginLeft: "8px" }}
        >
          Görev Listesini Göster
        </Button>
      </div>
      <div style={{ width: "10px" }}></div>
      <div style={{ width: "50%" }}>
        <h2>Tamamlananlar</h2>
        <div style={{ minHeight: "500px" }}>
          {completedTasks.map((task, index) => (
            <div
              key={task.Gorev}
              style={{
                userSelect: "none",
                padding: "16px",
                margin: "0 0 8px 0",
                minHeight: "50px",
                backgroundColor: "lightgreen",
                borderRadius: "4px",
              }}
            >
              <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
                {task.Gorev}
              </div>
              <div>
                {task.subtasks.map((subtask, subIndex) => (
                  <div key={subIndex} style={{ display: "flex", flexDirection: "column", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Checkbox checked={subtask.completed} disabled>
                        {subtask.AltGorev}
                      </Checkbox>
                      {subtask.Saat && (
                        <span style={{ marginLeft: "8px" }}>
                          {subtask.Saat}
                        </span>
                      )}
                      {subtask.AltGorevSorumlu && (
                        <Button
                          type="primary"
                          style={{ marginLeft: "auto", background: "linear-gradient(45deg, #9C27B0 0%, #E040FB 100%)", color: "white" }}
                        >
                          {subtask.AltGorevSorumlu}
                        </Button>
                      )}
                    </div>
                    {subtask.AltGorev1 && (
                      <div style={{ display: "flex", alignItems: "center", marginTop: "4px" }}>
                        <Checkbox checked={subtask.completed1} disabled>
                          {subtask.AltGorev1}
                        </Checkbox>
                        {subtask.Saat1 && (
                          <span style={{ marginLeft: "8px" }}>
                            {subtask.Saat1}
                          </span>
                        )}
                        {subtask.AltGorev1Sorumlu && (
                          <Button
                            type="primary"
                            style={{ marginLeft: "auto", background: "linear-gradient(45deg, #9C27B0 0%, #E040FB 100%)", color: "white" }}
                          >
                            {subtask.AltGorev1Sorumlu}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        title="Görev Ekle"
        visible={showModal}
        onOk={handleAdd}
        onCancel={handleCancel}
        okText="Ekle"
        cancelText="İptal"
      >
        <Input
          placeholder="Görev Adı"
          value={newTask}
          onChange={handleInputChange}
        />
         <Input
            placeholder="Başlangıç Tarihi"
            value={taskStartDate}
            onChange={handleStartDateChange}
          />
          <Input
            placeholder="Bitiş Tarihi"
            value={taskEndDate}
            onChange={handleEndDateChange}
          />
          
      </Modal>

      <Modal
        title="Alt Görev Ekle"
        visible={showSubtaskModal}
        onOk={handleSubtaskAdd}
        onCancel={handleSubtaskCancel}
        okText="Ekle"
        cancelText="İptal"
      >
        <Input
          placeholder="Alt Görev Adı"
          value={newSubtask}
          onChange={handleSubtaskInputChange}
        />
        <Input
          placeholder="Sorumlu Email"
          value={subtaskUser}
          onChange={(e) => setSubtaskUser(e.target.value)}
        />
        <Input
          placeholder="Saat"
          value={subtaskTime}
          onChange={handleSubtaskTimeChange}
        />
         <Input
            placeholder="Başlangıç Tarihi"
            value={subtaskStartDate}
            onChange={handleSubtaskStartDateChange}
          />
          <Input
            placeholder="Bitiş Tarihi"
            value={subtaskEndDate}
            onChange={handleSubtaskEndDateChange}
          />
      </Modal>

      <Modal
        title="Görev Sil"
        visible={showDeleteModal}
        onOk={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        okText="Sil"
        cancelText="İptal"
      >
        <p>{taskToDelete?.Gorev} görevini silmek istediğinize emin misiniz?</p>
      </Modal>
      <TaskListModal
        visible={showListModal}
        onOk={handleListModalOk }
        onClose={() => setShowListModal(false)}
        tasks={tasks}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default Board;
      