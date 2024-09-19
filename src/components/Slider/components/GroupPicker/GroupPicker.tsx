import styles from "./GroupPicker.module.css";
import React, { useContext, useEffect } from "react";
import { Button, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { ItineraryContext } from "../../../../context/ItineraryContext";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { getAllSlideIndexsInGroups, getGroupNames } from "../../../../utils";
import { group } from "console";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
export default function GroupPicker({ handleGroup, currentGroup }: any) {
  const { selectedDay } = useContext(ItineraryContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [groups, setGroups] = React.useState<any>([]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const groupNames = getGroupNames();
    if (groupNames.length > 0) {
      setGroups([...groupNames]);
    } else {
      setGroups([]);
    }
  }, [localStorage.getItem("trips")]);

  return (
    <div className={styles.container}>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <CreateNewFolderOutlinedIcon
          sx={{ width: 15, height: 15, color: "#333" }}
        ></CreateNewFolderOutlinedIcon>
      </IconButton>

      {selectedDay != undefined && (
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {currentGroup && (
            <MenuItem
              onClick={() => {
                handleGroup(undefined);
              }}
            >
              {"Remove from " + currentGroup}
            </MenuItem>
          )}

          {groups
            .filter((name: string) => {
              return name !== currentGroup;
            })
            .map((name: string, idx: number) => (
              <MenuItem
                onClick={() => {
                  console.log(name);
                  handleGroup(name);
                }}
              >
                {name}
              </MenuItem>
            ))}
          <MenuItem
            onClick={() => {
              const groupNames = getGroupNames();
              console.log(groupNames);
              const defaultNames = groupNames.filter(
                (name: string) =>
                  name.includes("Group ") && name !== currentGroup
              );
              const highest = defaultNames
                .map((name: string) => parseInt(name.split(" ")[1]))
                .sort((a: number, b: number) => a - b)
                .pop();
              // find the lowest number from the highest that is equal or greater to 1
              if (highest === undefined) {
                handleGroup("Group " + (groupNames.length + 1));
              } else {
                const lowest = Array.from(
                  { length: highest },
                  (_, i) => i + 1
                ).find((num) => !defaultNames.includes("Group " + num));
                if (lowest) {
                  handleGroup("Group " + lowest);
                } else {
                  handleGroup("Group " + (highest + 1));
                }
              }
            }}
          >
            {"New Group"}
          </MenuItem>
        </Menu>
      )}
    </div>
  );
}
