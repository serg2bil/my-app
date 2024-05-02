"use client"
import { Button } from "@nextui-org/react";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import Item from './item';
import style from "./../../pages/Home/Home.module.css"; 

import React, { useEffect } from "react";

import dayjs from "dayjs";
import FormDialog from "../dialog/openDialog";
import { fetchCount  } from '@/components/store/countSlice'

import { useDispatch, useSelector } from 'react-redux';






export default function Panel({ day , x}) {
  if (typeof window !== 'undefined') {
        
    var item = localStorage.getItem('user_id')
  }else{
    var item = ""
  }
    const [user_id, setUserId] = React.useState(item)
    const [data, setData] = React.useState({})
    const [open, setOpen] = React.useState(false);
    const [dataForm, setDataForm] = React.useState({id:'', type:'null', text:'', date:dayjs()})


    const {status, error} = useSelector(state => state.counts);
    const dispatch = useDispatch();

   
    var formData = new FormData;
    var arr = [dayjs().format('YYYY-MM-DD'), dayjs().add(1, 'day').format('YYYY-MM-DD'), dayjs().subtract(1, 'day').format('YYYY-MM-DD')];
    
    for (var i = 0; i < arr.length; i++) {
        formData.append('arr', arr[i]);
    }
    formData.append('user_id',  user_id)
    

    const tasks = data[calcDay(day)];

    
    useEffect(() => {
      updateData();
  }, []); 

  async function sendData(url, method, data) {
    
    try {
  
      data.user_id = user_id;
  
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();
      if (responseData.message === "Done") {
        await updateData();
      }
  
      return responseData;
    } catch (error) {
      console.error('There was an error!', error);
    }
  }

  async function updateData() {
    try {
      dispatch(fetchCount(formData))

      const response = await fetch(`/api/tasks?user_id=${user_id}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
        
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setData(data)
      console.log(data);
      console.log(tasks);
      console.log(arr);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }
  


 function calcDay(day){
  if(day === "tomorrow"){
    return(dayjs().add(1, 'day'))
  }else if (day === "yesterday"){
    return(dayjs().add(-1, 'day'))
  }else{
    return(dayjs())
  }
 }




  function sendSelect({ command, id, checked, text, selectedDate }) {
    switch (command) {
      case "edite": setDataForm({
          id: id,
          type: "edit",
          text: text,
          date: calcDay(day)
        });
        setOpen(true);
        break;
        case "create": setDataForm({
          type: "create",
          text: "",
          date: calcDay(day)
        });
        setOpen(true);
        break;

        case "delete":

          sendData(`/api/tasks`, 'DELETE', {id: id})
          break;
        case "created":
            if (selectedDate || text) {
              sendData('/api/tasks', 'POST', { text: text, date: selectedDate.format('YYYY-MM-DD') })
          }
          
          break;
        case "editd":
          if (selectedDate || text) {
            sendData(`/api/tasks`, 'PUT', { text: text, date: selectedDate.format('YYYY-MM-DD') , id: id})
          }
          break;
        case "change":
          sendData(`/api/tasks`, 'PATCH', { checked: checked, day: calcDay(day).format('YYYY-MM-DD') , id: id})
          break;
      
    }
  }
 
    return (
        
        <div className={ day==='today' ? style.yesterday :  style.yesterday}>
          
        
          <FormDialog
            handleOpen={setOpen}
            open={open}
            dataForm={dataForm}
            setDataForm={setDataForm}
            Select={(id, text, selectedDate, command) =>
              sendSelect({id, text, selectedDate, command })
            }
          />

            <div className={style.container}>
                <p className={style.text}>{day}</p>
                <div className={style.taskList}>
                    <div className={style.createTask}>
                        <Button disableRipple={true} onClick={() => sendSelect({command:"create"})} className={style.button}>
                            <ControlPointIcon />
                            <span>Add new task</span>
                        </Button>
                    </div>
                    <ul className={ x ? style.task2 : style.task}>
                      
                        {tasks && tasks.map(i =>
                            <Item key={i.id} text={i.text} id={i.id} sendSelect={(id, command, checked, text) => sendSelect({id, command, checked, text})} done={i.done} />
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}
