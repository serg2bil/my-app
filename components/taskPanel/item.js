"use client"
import React, { useState } from 'react';
import LongMenu from '../menu';
import style from "./../../pages/Home/Home.module.css"; 

export default function Item({ text, id, sendSelect, done }) {
    const [checked, setChecked] = useState(done);


    const handleChange = () => {
        sendSelect(id, "change", !checked);
        setChecked(!checked);
    };
    
    return (
        <label>
            <li key={id} className={checked ? style.done : ''}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                    className={style.checkbox}
                />
                {text}
                <LongMenu clickCommand={(command) => sendSelect(id, command, "", text)} />
            </li>
        </label>
    );
}
