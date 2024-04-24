
"use client";
import { Button } from "@mui/material";
import styles from "../../Landing/Landing.module.css";
import { Link } from "@nextui-org/react";
import {useState} from "react";
import { IconButton } from "@mui/material";
import { TextField, FormControl, InputLabel, OutlinedInput, InputAdornment } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LogLayout from "../layout";
import { useRouter } from "next/router";

export default function Home2() {
    const [showPassword, setShowPassword] = useState(false);
    const [error_login, setErrorLogin] = useState();
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [formErrors, setFormErrors] = useState({
        email: "",
        password: "",
        error:""
    });



    async function sendData(data) {
        const response = await fetch('/api/user?q=login'
            , {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }

            }
        );
        const responseData = await response.json();
        if (response.ok && responseData.user_id) {
            localStorage.setItem('user_id', responseData.user_id);
            router.push("/Home")

        } else {
            console.log(formErrors)
            setFormErrors({error:responseData.login_massage})
        }
    }







    const handleChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [id]: ""
        }));
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const validateEmail = (email) => {
        // Регулярное выражение для проверки правильности написания email
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const handleSubmit = () => {

        let errors = {};
        


        if (formData.email.trim() === "") {
            errors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            errors.email = "Invalid email address";
        }
        if (formData.password.trim() === "") {
            errors.password = "Password is required";
        }
        if (Object.keys(errors).length === 0) {
            
            sendData(formData)
            
        } else {
            
            setFormErrors(errors);
            
        }
    };

    return (
        
        <LogLayout>
                <h1 className={styles.title_singin}>Sign in</h1>

                <TextField sx={{ m: 1, width: '80%' }}
                    id="email"
                    label="Email"
                    placeholder="email.exemple@mail.com"
                    multiline
                    onChange={handleChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                />
                <FormControl sx={{ m: 2, width: '80%' }} variant="outlined">

                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                        onChange={handleChange}
                        error={!!formErrors.password}
                        
                    />
                    {formErrors.password !== "" ? <p className={styles.error}>{formErrors.password}</p> :""}
                    <p className={styles.error}>{formErrors.error}</p>
                   
                </FormControl>
                


                <Button
                    variant="contained"
                    color="success"
                    sx={{ width: '40%' }}

                    onClick={handleSubmit}
                ><span >Sign In</span>
                </Button>



                <div className={styles.bottom}>
                    <p>
                        Don't have an account? <Link href="/Landing/sign-up" >Sign up</Link>
                    </p>
                </div>
                </LogLayout>
    );
}
