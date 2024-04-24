import React from "react";
import style from "../Home.module.css"
import Link from "next/link";

export default function HomeFrame() {
  return (
    <div className={style.border}>
      <h1 className={style.title}>Wellcome to ToDoPy</h1>
      <p>
        A to-do app is a simple, user-friendly digital tool designed to help
        individuals and teams organize tasks and manage their daily activities
        efficiently. Users can create, edit, and prioritize tasks, set
        deadlines or reminders, categorize items, and track their progress, all
        within an intuitive and accessible interface. These apps are essential
        for improving productivity, reducing stress, and ensuring that important
        responsibilities are not forgotten.
      </p>
      <Link href="/Home/Upcoming" underline="none" color="inherit" className={style.link}><div>Go to tasks</div></Link>
    </div>
  );
}
