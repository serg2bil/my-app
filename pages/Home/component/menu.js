'use client'
import dayjs from "dayjs";
import Link from "next/link";
import { useState, useEffect } from 'react';
import style from "../Home.module.css"
import ListIcon from '@mui/icons-material/List';
import { fetchCount  } from '@/components/store/countSlice'


import { useDispatch, useSelector } from 'react-redux';

export default function Menu() {
    if (typeof window !== 'undefined') {
        
        var item = localStorage.getItem('key')
      }else{
        var item = ""
      }
    const [user_id, setUserId] = useState(item)
    const {status, error} = useSelector(state => state.counts);
    const dispatch = useDispatch();
    const count = useSelector(state => state.counts.count);
   
    var formData = new FormData;
    var arr = [dayjs().format('YYYY-MM-DD'), dayjs().add(1, 'day').format('YYYY-MM-DD'), dayjs().subtract(1, 'day').format('YYYY-MM-DD')];
    
    for (var i = 0; i < arr.length; i++) {
        formData.append('arr', arr[i]);
    }
    formData.append('user_id',  user_id)
    
    
    useEffect(() => {
        dispatch(fetchCount(formData));
    }, [dispatch]);

    const today = dayjs().format('YYYY-MM-DD')
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')

    const todayc = count ? count[today] : "0"
    const yesterdayc = count ? count[yesterday] : "0"
    const tomorrowc = count ? count[tomorrow] : "0"
    



    const tabs = [
        { name: "Upcoming", link: "/Upcoming" },
        { name: "Today", link: "/Today" },
        { name: "Tomorrow", link: "/Tomorrow" },
        { name: "Yesterday", link: "/Yesterday" }
    ];


    return (
        <div className={style.menu}>
            
            <div className={style.nav}>
                <div className={style.top}>
                    <h1 className={style.title}>Menu</h1>
                    <svg width="25" height="25" margin="5px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 10H3" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M21 6H3" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M21 14H3" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M21 18H3" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <ul className={style.tasks}>
                    <span>Tasks</span>
                    {tabs.map((tab, index) => (
                        <Link href={`/Home${tab.link}`} underline="none" className={style.link} key={index}>
                            <li className={style.page}>
                                <ListIcon color="action" />
                                <p>{tab.name}</p>
                                <span className={style.countMessages}>
                                        {tab.name === "Upcoming" && parseInt(todayc) + parseInt(yesterdayc) + parseInt(tomorrowc)}
                                        {tab.name === "Today" && todayc}
                                        {tab.name === "Yesterday" && yesterdayc}
                                        {tab.name === "Tomorrow" && tomorrowc}
                                    </span>
                            </li>
                        </Link>
                    ))}

                </ul>

            </div>
            <ul className={style.account}>
                <li className={style.signOut}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.625 13.125H3.125C2.79348 13.125 2.47554 12.9933 2.24112 12.7589C2.0067 12.5245 1.875 12.2065 1.875 11.875V3.125C1.875 2.79348 2.0067 2.47554 2.24112 2.24112C2.47554 2.0067 2.79348 1.875 3.125 1.875H5.625" stroke="black" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 10.625L13.125 7.5L10 4.375" stroke="black" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13.125 7.5H5.625" stroke="black" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span onClick={()=>{localStorage.setItem("user_id", ""); location.reload();}}>Sign Out</span>
                </li>
            </ul>


           
      
        </div>
    );
}

