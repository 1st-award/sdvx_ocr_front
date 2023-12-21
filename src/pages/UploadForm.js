import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";

function formatTime(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function KeepMountedModal({ open, setOpen, title, descript }) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
            {descript}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpen(false)}
            style={{ marginLeft: "85%", marginTop: "5%" }}
          >
            닫기
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

function UploadForm() {
  const history = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState(false);
  const [isReadOnly, setReadOnly] = useState(
    localStorage.getItem("user_name") !== null
  );
  const [title, setTittle] = useState();
  const [user_name, setUserName] = useState(
    localStorage.getItem("user_name") ?? ""
  );
  const [descript, setDescript] = useState("");
  const [data, setData] = useState({});
  const handleOpen = (title, descript) => {
    setTittle(title);
    setDescript(descript);
    setOpen(true);
  };
  const handleChange = (event) => {
    const id = event.target.id ?? "";
    const value = event.target.value ?? "";
    if (!["title", "difficulty", "result", "score"].includes(id)) {
      console.log(data["detail"]);
      const datum = data["detail"].find((datum) => datum["TYPE"] === id);
      console.log(datum);
      datum["VALUE"] = value;
    } else {
      data[id] = value;
    }
    setData({ ...data });
  };
  const handleUploadSubmit = (
    event,
    handleOpen,
    setShowData,
    setData,
    setLoading
  ) => {
    // console.log(event);
    // console.log(event.target[0].value);
    event.preventDefault();
    if (
      (event.target[1].value === "" && event.target[2].value === "") ||
      (event.target[1].value !== "" && event.target[2].value !== "")
    ) {
      handleOpen("전송애러", "파일을 한개만(는) 선택해야합니다");
    } else {
      setLoading(true);
      const data =
        event.target[2].value !== ""
          ? event.target[2].files[0]
          : event.target[3].files[0];
      const form_data = new FormData();
      form_data.append("file", data);
      axios({
        method: "post",
        url: "https://b6da-222-103-88-211.ngrok-free.app/api/v1/upload",
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
        data: form_data,
      })
        .then((result) => {
          setShowData(true);
          const data = result.data.data[0];
          // console.log(result.data.data);
          // console.log(result.data.data["score_result"]);
          const score_detail = [];
          if (data["detail"].length === 7) {
            const score_label = [
              "E-ERROR",
              "E-NEAR",
              "E-CRITICAL",
              "S-CRITICAL",
              "L-CRITICAL",
              "L-NEAR",
              "L-ERROR",
            ];
            let idx = 0;
            data["detail"].forEach((data) => {
              score_detail.push({ TYPE: score_label[idx], VALUE: data });
              idx += 1;
            });
          } else {
            const score_label = [
              "E-ERROR",
              "E-NEAR",
              "CRITICAL",
              "L-NEAR",
              "L-ERROR",
            ];
            let idx = 0;
            data["detail"].forEach((data) => {
              score_detail.push({ TYPE: score_label[idx], VALUE: data });
              idx += 1;
            });
          }
          data["detail"] = score_detail;
          setData(data);
        })
        .catch((error) => {
          // console.log(error);
          if (error.request.status === 400) {
            handleOpen("사진에러", "SDVX 사진이 아니거나, 사진이 불량합니다.");
          }
          // console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const handleSaveSubmit = (
    event,
    handleOpen,
    setLoading,
    user_name,
    history
  ) => {
    event.preventDefault();
    setLoading(true);
    console.log(data);
    const req_body = {};
    const form_data = new FormData();
    form_data.append("TITLE", data["title"]);
    form_data.append("DIFFICULTY", data["difficulty"]);
    form_data.append("RESULT", data["result"]);
    form_data.append("SCORE", data["score"]);
    form_data.append("SCORE_DETAIL", JSON.stringify(data["detail"]));
    form_data.append("USERNAME", user_name);
    form_data.append("DT", formatTime(new Date()));
    form_data.forEach((value, key) => {
      req_body[key] = value;
    });
    console.log(req_body);
    axios({
      method: "post",
      url: "https://b6da-222-103-88-211.ngrok-free.app/api/v1/record",
      headers: {
        "Content-Type": `application/json`,
        "ngrok-skip-browser-warning": "69420",
      },
      data: JSON.stringify(req_body),
    })
      .then((result) => {
        // console.log(result);
        handleOpen("저장 완료", "저장 되었습니다.");
        history("/rank");
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };
  return (
    <>
      <KeepMountedModal
        open={open}
        setOpen={setOpen}
        title={title}
        descript={descript}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        component="form"
        noValidate
        onSubmit={(event) =>
          handleUploadSubmit(
            event,
            handleOpen,
            setShowData,
            setData,
            setLoading
          )
        }
        sx={{ p: 2 }}
      >
        <FormControl key="1" component="fieldset" variant="standard">
          <Grid container spacing={4} style={{ width: "100vw" }}>
            <Grid item xs={2} sm={8} md={8} />
            <Grid item xs={6} sm={3} md={3}>
              {" "}
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
            <Grid item xs={4} sm={1} md={1}>
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
            <Grid item xs={12} sm={6} md={6}>
              <Button
                id="camera"
                color="info"
                component="label"
                variant="contained"
                size="large"
                fullWidth
              >
                사진 찍기
                <input
                  type="file"
                  accept="image/jpg, image/jpeg, image/png"
                  capture="camera"
                  hidden
                />
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Button
                id="gallary"
                color="secondary"
                component="label"
                variant="contained"
                size="large"
                fullWidth
              >
                사진 선택
                <input
                  type="file"
                  accept="image/jpg, image/jpeg, image/png"
                  hidden
                />
              </Button>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Button type="submit" variant="contained" size="large" fullWidth>
                전송
              </Button>
            </Grid>
          </Grid>
        </FormControl>
      </Box>
      {showData ? (
        <Box
          component="form"
          noValidate
          onSubmit={(event) =>
            handleSaveSubmit(event, handleOpen, setLoading, user_name, history)
          }
          sx={{ p: 2 }}
        >
          <FormControl key="2" component="fieldset" variant="standard">
            <Grid container spacing={5} style={{ width: "100vw" }}>
              <Grid item xs={8} sm={3} md={3}>
                <TextField
                  required
                  id="title"
                  label="곡 제목"
                  value={data["title"] ?? ""}
                  variant="standard"
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4} sm={3} md={3}>
                <TextField
                  required
                  id="difficulty"
                  label="난이도"
                  value={data["difficulty"] ?? ""}
                  variant="standard"
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={7} sm={3} md={3}>
                <TextField
                  required
                  select
                  id="result"
                  label="결과"
                  value={data["result"] || ""}
                  onChange={handleChange}
                  defaultValue="COMPLETE"
                  variant="standard"
                  fullWidth
                >
                  {["COMPLETE", "CRASH", "ULTIMATE CHAIN", "PERFECT"].map(
                    (option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </Grid>
              <Grid item xs={5} sm={3} md={3}>
                <TextField
                  required
                  type="number"
                  id="score"
                  label="점수"
                  value={data["score"] ?? ""}
                  variant="standard"
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <Typography style={{ marginBottom: "-5%", fontSize: "1.3rem" }}>
                  세부점수
                </Typography>
              </Grid>
              {data["detail"].map((data) => (
                <Grid item xs={6} sm={3} md={3}>
                  <TextField
                    required
                    id={data["TYPE"] ?? ""}
                    label={data["TYPE"] ?? ""}
                    value={data["VALUE"] ?? ""}
                    variant="standard"
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
              ))}
            </Grid>
            <br />
            <Grid item xs={12} sm={12} md={12}>
              <Button type="submit" variant="contained" size="large" fullWidth>
                저장
              </Button>
            </Grid>
          </FormControl>
        </Box>
      ) : (
        <br />
      )}
    </>
  );
}

export default UploadForm;
