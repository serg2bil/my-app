"use client"
import Menu from "./component/menu";
import style from "./Home.module.css"
import React, { useEffect } from "react";
import { useRouter } from "next/router";


export default function Layout({ children }) {
  const router = useRouter()
useEffect(() => {
  
    if(!localStorage.getItem("user_id")){
        router.push("/")
    }

},[])
  return (
    
    <div className={style.main}>
      
      <Menu />
      <div className={style.content}>
      {children}
      
      </div>
    </div>
    
  )
}