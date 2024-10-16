import React, {useEffect, useState} from "react";
import './App.css';
import { AiOutlineDelete } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos,setTodos] = useState([]);
  const [newTitle,setNewTitle] = useState("");
  const [newDescription,setNewDescription] = useState("");
  const [completedTodos,setCompletedTodos] = useState([]);
  const [currentEdit,setCurrentEdit] = useState("");
  const [currentEditedItem,setCurrentEditedItem] = useState("");


  const handleAddTodo = ()=>{
    if (!newTitle || !newDescription) {
      alert("Please enter both title and description");
      return;
    }

    let newTodoItem = {
      title:newTitle,
      description:newDescription
    }
    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    setTodos(updatedTodoArr);
    localStorage.setItem('todolist',JSON.stringify(updatedTodoArr));

    setNewTitle("");
    setNewDescription("");
  };

  const handleDeleteTodo = (index) =>{
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index,1);
    localStorage.setItem("todolist",JSON.stringify(reducedTodo));
    setTodos(reducedTodo);

    
  };

  const handleComplete = (index) =>{
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yr = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn = dd + "/"+ mm+"/"+yr+" at "+h+":"+m+":"+s;

    let filteredItem = {
      ...allTodos[index],
      completedOn:completedOn,

    }
    let updateCompletedArr =[...completedTodos];
    updateCompletedArr.push(filteredItem);
    setCompletedTodos(updateCompletedArr);
    handleDeleteTodo(index);
    localStorage.setItem('completedTodos',JSON.stringify(updateCompletedArr));
  };

  const handleDeleteCompletedTodo = (index) => {
    let reducedTodo = [...completedTodos];
    reducedTodo.splice(index,1);
    localStorage.setItem("completedTodos",JSON.stringify(reducedTodo));
    setCompletedTodos(reducedTodo);
  }
  const handleEdit = (index,item) => {
    console.log(index);
    setCurrentEdit(index);
    setCurrentEditedItem(item);
  };
  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) =>{
      return {...prev,title:value}
    })
  };

  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) =>{
      return {...prev,description:value}
    })
  };

  const handleUpdateTodo = () =>{
    let newTodo = [...allTodos];
    newTodo[currentEdit] = currentEditedItem;
    setTodos(newTodo);
    setCurrentEdit("");
  }
  useEffect(()=>{
    let saveTodo = JSON.parse(localStorage.getItem('todolist'));
    let saveCompletedTodo = JSON.parse(localStorage.getItem('completedTodos'));
    if(saveTodo){
      setTodos(saveTodo);
    }
    if(saveCompletedTodo){
      setCompletedTodos(saveCompletedTodo);
    }
  },[]);
  return (
    <div className="App">
      <h1>My ToDo App</h1>
      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input type="text" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} placeholder="what is the task title?"/>
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input type="text"  value={newDescription} onChange={(e)=>setNewDescription(e.target.value)} placeholder="what is the task description?"/>
          </div>
          <div className="todo-input-item">
            <button type="button" onClick={handleAddTodo} className="primaryBtn">Add Task</button>
          </div>
        </div>
        <div className="button-area">
          <button className={`secondaryBtn ${isCompleteScreen===false && 'active'}`} onClick={()=>setIsCompleteScreen(false)}>ToDo</button>
          <button className={`secondaryBtn ${isCompleteScreen===true && 'active'}`} onClick={()=>setIsCompleteScreen(true)}>Completed</button>
        </div>
        <div className="todo-list">
          {isCompleteScreen===false && allTodos.map((item,index) => {
            if(currentEdit===index) {
              return(
                <div className="edit__wrapper" key={index}>
                <input placeholder="Updated Title" onChange={(e) => handleUpdateTitle(e.target.value)} value={currentEditedItem.title}/>
                <textarea placeholder="Updated Description" rows={4} onChange={(e) => handleUpdateDescription(e.target.value)} value={currentEditedItem.description}/>
                <button type="button" onClick={handleUpdateTodo} className="updateBtn">Edit Task</button>
                </div>
              );
            }else{
              return (
                <div className="todo-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div className="icons">
                  <AiOutlineDelete  className='del-icon' onClick={()=>handleDeleteTodo(index)} title="Delete"/>
                  <FaCheck className='check-icon' onClick={() => handleComplete(index)} title="Complete"/>
                  <FaEdit className="check-icon" onClick={() =>handleEdit(index,item)} title="Edit"/>
                </div>
              </div>
              )
            }
          })
          }

          {isCompleteScreen===true && completedTodos.map((item,index) => {
            return (
              <div className="todo-list-item" key={index}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p><small><i>Completed On: {item.completedOn}</i></small></p>
              </div>
              <div className="icons">
                <AiOutlineDelete  className='del-icon' onClick={()=>handleDeleteCompletedTodo(index)} title="Delete"/>
              </div>
            </div>
            )
          })
          }

        </div>
      </div>
    </div>
  );
}

export default App;
