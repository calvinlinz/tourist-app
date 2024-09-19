import React, { useContext } from "react";
import styles from "./ConfirmationBox.module.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ItineraryContext } from "../../../context/ItineraryContext";
import { SuggestedPOI } from "../../../types";

interface ConfirmationBoxProps {
  open: any;
  handleClose: (confirm: SuggestedPOI | null) => void;
}

export default function ConfirmationBox(props: ConfirmationBoxProps) {
  const { swapPOI } = useContext(ItineraryContext);

  return (
    <React.Fragment>
      {props.open && (
        <Dialog
          open={props.open}
          onClose={() => props.handleClose(null)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {props.open ? (
                <span>
                  Are you sure you want to swap <strong>{swapPOI?.poi.name}</strong>{" "}
                  for <strong>{props.open.name}</strong>?
                </span>
              ) : (
                "No data"
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => props.handleClose(props.open)} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </React.Fragment>
  );
}
