import React from 'react'
import { Grid, Paper, Typography, Button, Box, TextField, IconButton, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
const FolderList = ({ folders, handleFolderSelect, selectedFolder,isFolderSynced }) => {
    return (
      <Grid container justifyContent="left"  sx={{ p: 1 }}>
        {folders.map((folder) => (
          <Grid item key={folder.folder_id} xs={12} sm={6} md={4} lg={3} xl={2} sx={{ p: 0 }}>
            <Paper
              elevation={1}
              sx={{
                position: "relative",
                width: 180,
                height: 180,
                m: 'auto',
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                mt: 4,
                gap: 1,
                
                borderRadius: "8px", 
                bgcolor: selectedFolder && selectedFolder.id === folder.folder_id ? "action.selected" : "",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={() => {
                  if (!isFolderSynced) {  // Only allow selecting if no folder has been synced
                handleFolderSelect(folder.folder_id, folder.folder_name);
                  }
                }}>
              {selectedFolder && selectedFolder.id === folder.folder_id && (
                <CheckCircleIcon sx={{ color: "green", position: "absolute", top: 8, right: 8, fontSize: "1.5rem" }} />
              )}
              <FolderIcon sx={{ fontSize: 80 }} />
              <Typography variant="subtitle2" noWrap>
                {folder.folder_name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  };
 export default FolderList;  