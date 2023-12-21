import axios from "axios";
import {
  Backdrop,
  CircularProgress,
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";

function ResultTable() {
  // Implement your table display logic here
  const [loading, setLoading] = useState(false);
  const [isReadOnly, setReadOnly] = useState(
    localStorage.getItem("user_name") !== null
  );
  const [user_name, setUserName] = useState(
    localStorage.getItem("user_name") ?? ""
  );
  const [data, setData] = useState([]);

  useEffect(() => {
    if (isReadOnly) {
      console.log(11, user_name);
      setLoading(true);
      axios({
        method: "get",
        url: `https://b6da-222-103-88-211.ngrok-free.app/api/v1/record/${user_name}`,
        headers: {
          "Content-Type": `application/json`,
          "ngrok-skip-browser-warning": "69420",
        },
      })
        .then((result) => {
          console.log(result);
          setData(result.data.data);
        })
        .catch((error) => {
          console.log(error);
          setData([]);
        })
        .finally(() => setLoading(false));
    }
  }, [isReadOnly, user_name]);
  return (
    <Box sx={{ p: 2 }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container spacing={4} style={{ width: "100vw" }}>
        <Grid item xs={12} sm={6} md={8} />
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            required
            id="username"
            label="이름"
            value={user_name}
            variant="standard"
            onChange={(event) => {
              setUserName(event.target.value);
              localStorage.setItem("user_name", event.target.value);
            }}
            InputProps={{
              disabled: isReadOnly,
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={1}>
          <Button
            id="confirm"
            color="info"
            component="label"
            variant="contained"
            size="large"
            onClick={(event) =>
              isReadOnly ? setReadOnly(false) : setReadOnly(true)
            }
            fullWidth
          >
            확인
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          {loading ? (
            <br />
          ) : (
            <Table sx={{ minWidth: 100 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">제목</TableCell>
                  <TableCell align="center">난이도</TableCell>
                  <TableCell align="center">점수</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row["DT"]}>
                    <TableCell align="left">{row["TITLE"]}</TableCell>
                    <TableCell align="left">{row["DIFFICULTY"]}</TableCell>
                    <TableCell align="left">{row["SCORE"]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ResultTable;
