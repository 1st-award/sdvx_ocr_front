import * as React from "react";
import { Link, Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Paper from "@mui/material/Paper";

export default function DefaultLayout() {
  let idx;
  // console.log(window.location.pathname);
  switch (window.location.pathname) {
    case "/camera":
      idx = 0;
      break;
    case "/rank":
      idx = 1;
      break;
    default:
      idx = 0;
  }
  // console.log(idx);
  const [value, setValue] = React.useState(idx);
  return (
    <Box sx={{ pb: 7 }}>
      <CssBaseline />
      <Outlet />
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            LinkComponent={Link}
            to="/camera"
            label="기록"
            icon={<RestoreIcon />}
          />
          <BottomNavigationAction
            LinkComponent={Link}
            to="/rank"
            label="기록 보기"
            icon={<FavoriteIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
