'use client'
import React, { useState, useEffect } from "react";
import { Button, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { Link } from "@nextui-org/react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import styles from "../../Landing/Landing.module.css";
import LogLayout from "../layout";
import { useRouter } from "next/router";


export default function Home1() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter()
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        reEnteredPassword: ""
    });
    const [formErrors, setFormErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        reEnteredPassword: "",
        error:""
    });



    async function sendData(data) {
        const response = await fetch('/api/user'
            , {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }

            }
        );
        const responseData = await response.json();
        if (response.ok && response.status == "200") {

            localStorage.setItem('user_id', responseData.user_id);
            router.push("/Home")

        } else {
            console.log(responseData.error);
            setFormErrors({error:responseData.error_m})
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
        if (formData.firstName.trim() === "") {
            errors.firstName = "First name is required";
        }
        if (formData.lastName.trim() === "") {
            errors.lastName = "Last name is required";
        }
        if (formData.email.trim() === "") {
            errors.email = "Email is required";
        
        }else if(!validateEmail(formData.email)) {
            errors.email = "Invalid email address";
        }
        if (formData.password.trim() === "") {
            errors.password = "Password is required";
        }
        if (formData.reEnteredPassword.trim() === "") {
            errors.reEnteredPassword = "Please re-enter your password";
        } else if (formData.reEnteredPassword !== formData.password) {
            errors.reEnteredPassword = "Passwords do not match";
        }
        if (Object.keys(errors).length === 0) {
            sendData(formData)
        } else {
            setFormErrors(errors);
            console.log(formErrors);


        }
    };

    return (
        <LogLayout>
            
            <h1 className={styles.title_singin}>Sign in</h1>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={6}>
                    <TextField
                        id="firstName"
                        label="First Name"
                        onChange={handleChange}
                        error={!!formErrors.firstName}
                        helperText={formErrors.firstName}
                        sx={{
                            marginLeft: "20%",
                            width: '75%'
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="lastName"
                        label="Last Name"
                        onChange={handleChange}
                        error={!!formErrors.lastName}
                        helperText={formErrors.lastName}
                        sx={{
                            marginLeft: "5%",
                            width: '75%'
                        }}
                    />
                </Grid>
            </Grid>

            <TextField
                id="email"
                label="Email"
                placeholder="email.exemple@mail.com"
                multiline
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                sx={{ m: 1, width: '80%' }}
            />
            <p className={styles.error}>{formErrors.error}</p>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={6}>
                    <FormControl
                        sx={{
                            marginLeft: "20%",
                            width: '75%'
                        }}
                        variant="outlined"
                    >
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
                        {formErrors.password !== "" ? <p className={styles.error}>{formErrors.password}</p> : ""}
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl
                        sx={{
                            marginLeft: "5%",
                            width: '75%'
                        }}
                        variant="outlined"
                    >
                        <OutlinedInput
                            id="reEnteredPassword"
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
                            placeholder="Re-enter the password"
                            onChange={handleChange}
                            error={!!formErrors.reEnteredPassword}

                        />
                        {formErrors.reEnteredPassword !== "" ? <p className={styles.error} p>{formErrors.reEnteredPassword}</p> : ""}

                    </FormControl>

                </Grid>

            </Grid>

            <Button
                variant="contained"
                color="success"
                sx={{ m: 2, width: '40%' }}
                onClick={handleSubmit}
            >
                <span>Sign In</span>
            </Button>

            <div className={styles.bottom}>
                <p>
                    Already have an account?<Link href="/Landing/sign-in"> Sign In</Link>
                </p>
            </div>

        </LogLayout>
    );
}
