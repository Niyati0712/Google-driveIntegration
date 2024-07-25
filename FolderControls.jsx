import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import RefreshIcon from "@mui/icons-material/Refresh";
import CircularProgress from '@mui/material/CircularProgress';

const FolderControls = ({searchTerm, 
  handleSearchChange, 
  sortOrder, 
  handleSortChange, 
  refreshFolders, 
  loadingSort, 
  loadingRefresh}) => {
  return (
    <Box 
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        marginRight: 8,
        gap: 2,
        marginTop: 4
      }}
    >
      <TextField
        label="Search Folder"
        variant="outlined"
        value={searchTerm}
        size="small"
        onChange={handleSearchChange}
        sx={{ borderRadius: '50px', minWidth: 120 }}
      />
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="sort-label">Sort By Date</InputLabel>
        <Select
          labelId="sort-label"
          value={sortOrder}
          label="Sort By Date"
          onChange={handleSortChange}
        >
          <MenuItem value="asc">Oldest First</MenuItem>
          <MenuItem value="desc">Newest First</MenuItem>
        </Select>
        {loadingSort && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }} />}
      </FormControl>
      <IconButton onClick={refreshFolders} sx={{ border: '1px solid #ccc', borderRadius: '50%' }}>
      {loadingRefresh ? <CircularProgress size={24} /> : <RefreshIcon />}
      </IconButton>
    </Box>
  );
};
export default FolderControls;