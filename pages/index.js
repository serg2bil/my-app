import style from "./Landing/Landing.module.css";
import LogLayout from "./Landing/layout";
import Link from "next/link";
import { Button } from "@mui/material";
export default function Login(){
    return(
        <LogLayout>
            <h1>ToDO Py</h1>
                <p>
                    Stay Organized, Get Things Done: Your Ultimate To-Do List App.
                    <br />A todo list app is a digital task management tool designed to
                    help users organize and prioritize their daily activities and
                    responsibilities.
                </p>

                <Link  href="/Landing/sign-up" ><Button sx={{  width: '250px' }} variant="contained" color="success" >
                <span >Get Started</span>
                   
                    </Button></Link>
                



                <div className={style.bottom}>
                    <p>
                        Already have an account? <Link href="/Landing/sign-in">Sign In</Link>
                    </p>
                </div>
        </LogLayout>
    )
}