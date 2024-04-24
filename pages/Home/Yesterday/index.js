"use client"

import style from "../Home.module.css"
import React from "react";
import dayjs from "dayjs";
import Panel from "@/components/taskPanel/content";
import Layout from "../layout";
import { useSelector } from "react-redux";

export default function YesterdayFrame() {
  const count = useSelector(state => state.counts.count);
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')



  const yesterdayc = count ? count[yesterday] : "0"

  
  return (
    <Layout>
    <div>
      <div className={style.top}>
        <h1 className={style.title}>Yesterday</h1>
        <div className={style.count}>
          <p>{yesterdayc}</p>
        </div>
      </div>
      <Panel
          day={"yesterday"}
          x={true}
        />
    </div>
    </Layout>
  );
}
