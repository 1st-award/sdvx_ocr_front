import { Box, Container, Grid, Typography } from "@mui/material";

/* Icons */
import { TbError404 } from "react-icons/tb";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

export default function Page404() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid xs={6}>
            <div
              style={{ position: "inherit", transform: "translate(0%, -10%)" }}
            >
              <TbError404
                style={{ display: "block", width: "100%", height: "auto" }}
              />
              <Typography
                variant="h5"
                fontFamily={"nanumfont-light"}
                style={{ transform: "translate(8%, -250%)" }}
              >
                찾으시는 페이지가 없습니다.
              </Typography>
            </div>
          </Grid>
          <Grid xs={6}>
            <SentimentVeryDissatisfiedIcon
              style={{ display: "block", width: "100%", height: "auto" }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
