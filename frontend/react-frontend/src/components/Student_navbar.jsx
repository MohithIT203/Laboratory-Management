import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
const pages = ['Book Slot', 'Attendance','Dashboard'];
const settings = ['Account', 'Logout'];

function MiniAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [active, setActive] = React.useState("Dashboard");
    const navigate = useNavigate();
    const location = useLocation();
  
    React.useEffect(() => {
      const map = {
        "/student/dashboard": "Dashboard",
        "/student/attendance": "Attendance",
        "/student/all-slots": "Slots Summary",
      };
      setActive(map[location.pathname] || "");
    }, [location.pathname]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

const handleCloseNavMenu = (page) => {
    setAnchorElNav(null); 
    if (page === "Attendance") {
      navigate('/student/attendance');
    } else if (page === "Book Slot") {
      navigate('/student/all-slots');
    } else if (page === "Dashboard") {
      navigate('/student/dashboard');
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handlelogout = async (setting) => {
   
  if (setting.toLowerCase() === "logout") {
     try {
      const response = await axios.post("http://localhost:4000/api/user/logout", {
      },{ withCredentials: true });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Logout error");
    }
  }
};

  return (
    <AppBar
      position="static"
      elevation={0} 
       sx={{
        background: "linear-gradient(135deg, #0dc789 0%, #067d58 100%)",
        borderBottom: "none",
        boxShadow: "none",
        color: "white",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              letterSpacing: '.1rem',
              color: '#ffffff',
              textDecoration: 'none',
            }}
          >
            Lab Management
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="#fffff"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={()=>handleCloseNavMenu(page)}>
                  <Typography sx={{ textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}>
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, flexDirection: "row-reverse" }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleCloseNavMenu(page)}
                sx={{
                  my: 2,
                  color: active === page ? "#000000" : "#ffffff",
                  display: "block",
                  fontFamily: "Inter, sans-serif",
                  textTransform: "none",
                  fontWeight: active === page ? 700 : 500,
                  borderRadius: "8px",
                  px: 2,
                  background: active === page ? "#ffffff" : "transparent", 
                  "&:hover": {
                    background:
                      active === page
                        ? "#ffffff"
                        : "rgba(255,255,255,0.2)", 
                  },
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0,paddingLeft:"25px" } }>
                <Avatar
                    sx={{ height:"50px",width:"50px" }}
                alt="User Avatar" src="https://thumbs.dreamstime.com/b/man-profile-cartoon-smiling-round-icon-vector-illustration-graphic-design-135443422.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '40px' }}
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center', fontFamily: 'Poppins, sans-serif' }} onClick={() => handlelogout(setting)}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default MiniAppBar;
