import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers-pro';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function FormDialog({ handleOpen, open, Select, dataForm }) {

    const [selectedDate, setSelectedDate] = React.useState({});
    useEffect(() => setSelectedDate(dataForm.date), [dataForm.date]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleClose = () => {
        handleOpen(false);
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const text = formJson.text;
                        Select(dataForm.id, text, selectedDate, `${dataForm.type}d`);
                        handleClose();
                    },
                }}
            >
                <DialogTitle>{dataForm.type === "edit" ? "Edit task" : "Add Task"}</DialogTitle>
                <DialogContent>
                    
                    <TextField
                        autoFocus
                        required
                        id="outlined-basic"
                        name='text'
                        variant="outlined"
                        margin="dense"
                        defaultValue={dataForm.text}
                        label={dataForm.type !== "edit" ? "Please enter your text" : "Text" }
                        type="text"
                        fullWidth
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            value={selectedDate}
                            onChange={handleDateChange}

                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Comfirm</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
