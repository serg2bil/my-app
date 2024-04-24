import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import style from "./../pages/Home/Home.module.css"; 

const options = [
  {
    text: 'Edit',
    command: 'edite'
  },
  {
    text: 'Delete',
    command: 'delete'
  },
];

const ITEM_HEIGHT = 48;

export default function LongMenu({ clickCommand }) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (command) => {
   
    clickCommand(command);
    handleClose();
  };

  return (
    <div className={style.menuList}>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.command} onClick={() => handleMenuItemClick(option.command)}>
            {option.text}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
