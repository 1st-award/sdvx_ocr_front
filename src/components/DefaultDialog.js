import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function DefaultDialog({
  open = false,
  title,
  descript,
  agreeText = "예",
  disagreeText = "아니오",
  handleAgree,
  handleDisagree,
}) {
  return (
    <Dialog
      open={open}
      onClose={handleDisagree}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" fontFamily={"nanumfont"}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          fontFamily={"nanumfont-light"}
        >
          {descript}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={handleAgree}
          fontFamily={"nanumfont"}
        >
          {agreeText}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDisagree}
          fontFamily={"nanumfont"}
          autoFocus
        >
          {disagreeText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
