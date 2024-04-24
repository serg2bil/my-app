"use client"

import style from "../Home.module.css"
import React from "react";
import dayjs from "dayjs";
import Panel from "@/components/taskPanel/content";
import Layout from "../layout";
import { useSelector } from 'react-redux';

export default function TomorrowFrame() {
  const count = useSelector(state => state.counts.count);
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')


  const tomorrowc = count ? count[tomorrow] : "0"

  return (
    <Layout>
    <div className={style.todayFrame}>
      <div className={style.top}>
        <h1 className={style.title}>Tomorrow</h1>
        <div className={style.count}>
          <p>{tomorrowc}</p>
        </div>
      </div>
      <Panel
      x={true}
          day={"tomorrow"}
        />
    </div>
    </Layout>
  );
}
