import { useEffect } from "react";
import style from "./Landing.module.css";
import { useRouter } from "next/router";
export default function LogLayout({ children }) {
     const router = useRouter()
    useEffect(() => {
        if(localStorage.getItem("user_id")){
            router.push("/Home")
        }
    },[])
    


    return (
<div className={style.main}>
        <div className={style.content}>
        
            {children}
            
        </div>
    </div>
      
    )
  }