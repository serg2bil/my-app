"use client"

import style from "../Home.module.css"

import Panel from "@/components/taskPanel/content";
import Layout from "../layout";
import dayjs from "dayjs";
import { useSelector } from 'react-redux';


export default function Upcoming() {


  const count = useSelector(state => state.counts.count);

  const today = dayjs().format('YYYY-MM-DD')
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')

  const todayc = count ? count[today] : "0"
  const yesterdayc = count ? count[yesterday] : "0"
  const tomorrowc = count ? count[tomorrow] : "0"
  



  return (
    <Layout>
    <div>
      <div className={style.top}>
        <h1 className={style.title}>Upcoming</h1>
        <div className={style.count}>
          <p>{parseInt(todayc) + parseInt(yesterdayc) + parseInt(tomorrowc)}</p>
        </div>
      </div>
      <Panel
        day={"today"}
      />
      <div className={style.other}>
        <Panel
          day={"tomorrow"}
        />
        <Panel
          day={"yesterday"}
        />
      </div>
    </div>
    </Layout>
  );
}
