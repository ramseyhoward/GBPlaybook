import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { Outlet, Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { useLocation } from "react-router-dom";
import { CssBaseline } from "@mui/material";

function MyAppBar(props: any) {
  let location = useLocation();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ flexDirection: "row-reverse" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={props.onClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography>{location.pathname}</Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

// const darkTheme = createTheme({
//   palette: {
//     mode: "dark",
//   },
//   components: {
//     MuiCssBaseline: {
//       styleOverrides: {
//         body: {
//         },
//       },
//     },
//   },
// });
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3d708f",
    },
    secondary: {
      main: "#ffb300",
    },
    background: {
      default: "#121a22",
      paper: "#344556",
    },
  },
});

function App() {
  const [drawer, setDrawer] = React.useState(false);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <MyAppBar onClick={() => setDrawer(true)} />
        <Drawer
          // variant="persistent"
          anchor="right"
          open={drawer}
          onClose={() => setDrawer(false)}
        >
          <nav>
            <ul>
              <li>
                <Link to="GamePlay">GamePlay</Link>
              </li>
              <li>
                <Link to="Library">Library</Link>
              </li>
            </ul>
          </nav>
        </Drawer>
        {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
        {/* <nav>
        <Link to="GamePlay">GamePlay</Link> | <Link to="Library">Library</Link>
      </nav> */}
        <Outlet />
      </div>
    </ThemeProvider>
  );
}

export default App;
