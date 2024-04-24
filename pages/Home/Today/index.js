"use client"

import style from "../Home.module.css"
import {useState, useEffect} from "react";
import { useSelector } from 'react-redux';
import Panel from "@/components/taskPanel/content";
import Layout from "../layout";
import dayjs from "dayjs";

export default function TodayFrame() {

  const count = useSelector(state => state.counts.count);
  const today = dayjs().format('YYYY-MM-DD')


  const todayc = count ? count[today] : "0"

  







  return (
    <Layout>
    <div className="todayPage">
      <div className={style.top}>
        <h1 className={style.title}>Today</h1>
        <div className={style.count}>
          <p>{todayc}</p>
        </div>
      </div>
      <Panel
        day={"today"}
        x={'true'}
      />
    </div>
    </Layout>
  );
}
