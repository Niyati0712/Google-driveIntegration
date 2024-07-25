import React, { useState, useEffect, memo } from "react";
import { Grid, Paper, Typography, Button, Box, TextField, IconButton, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import SyncIcon from "@mui/icons-material/Sync";
import AuthContext from "../../context/AuthContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StateOneComponent from "./StateOneComponent";
import CircularProgress from '@mui/material/CircularProgress';
import RefreshIcon from "@mui/icons-material/Refresh";
import FolderList from "./FolderList";
import FolderControls from "./FolderControls";
import toast from "react-hot-toast";
const Googledrive = memo(() => {
  const [folders, setFolders] = useState([]);
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [state1, setstate1] = useState(false);
  const [state2, setstate2] = useState(false);
  const [state3, setstate3] = useState(false);
  const [email, setEmail] = useState(""); // State to store the email
  const { authUser } = React.useContext(AuthContext);

  const [syncedFolders, setsyncedFolders] = useState([]);
  const [notsyncfolders, setnotsyncfolders] = useState([]);
  const [isFolderSynced, setIsFolderSynced] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [loadingSync, setLoadingSync] = useState(false);
  const [loadingSort, setLoadingSort] = useState(false);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
 const [windowOpen, setWindowOpen] = useState(null);
 const [islogin, setIslogin] = useState(false);

 

  useEffect(() => {
    // setLoading(true);
    gatherinfo();
    console.log("Called two times");
  
  }, []);
  const gatherinfo = () =>{
    setLoading(true);
    fetch("https://copipeline.veriproc.com/gdrive/checkUserInfo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        b2b_user_uid: authUser.b2b_user_uid
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success" && data.loginRequired === false ) {
          setnotsyncfolders(data.data.all_folders || []);
          setsyncedFolders(data.data.integrated_folder ? [data.data.integrated_folder] : []);
          setstate1(false);
          setstate2(false);
          setstate3(true);
          setIslogin(data.loginRequired);

          
           
        }
        else if( data.status === "success" && data.loginRequired === true && data.isSessionExpired === false)
          {
            setstate1(true);
            setstate2(false);
            setstate3(false);
          }
          else if( data.status === "success" && data.loginRequired === true && data.isSessionExpired === true)
          {
            toast.error("Authorization expired. Please reauthorize to check the integration status")
            setstate1(true);
            // setIsSession(data.loginRequired);
            setstate2(false);
            setstate3(false);
          }
         else {
          throw new Error("API response was not successful.");
        }
      })
      .catch((err) => {
        toast.error(err.message || "Failed to fetch folders.");
        setnotsyncfolders([]); // Ensure you're setting an empty array on error
  setsyncedFolders([]);
      })
      .finally(() => {
        setLoading(false);
        setInitialCheckDone(true); // Indicate that initial check is completed
      });
  }

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin === "https://copipeline.veriproc.com" && event.data) {
        setEmail(event.data);
        console.log(email);
        windowOpen?.close();
        gatherinfo();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [windowOpen]);
 
  const fetchFolders =(currentSortOrder = sortOrder, fromRefresh = false) =>{
    if (!email) return Promise.resolve();// Early exit if email is not set
    const setLoading = fromRefresh ? setLoadingRefresh : setLoadingSort;
    setLoading(true);
    return fetch("https://copipeline.veriproc.com/gdrive/getFoldersInfo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        b2b_user_uid: authUser.b2b_user_uid,
        email: email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setFolders(data.data);
        setFilteredFolders(sortFolders(data.data, sortOrder));
           
        } else {
          throw new Error("API response was not successful.");
        }
      })
      .catch((err) => {
        toast.error(err.message || "Failed to fetch folders.");
      })
      .finally(() => {
        setLoading(false); // Deactivate loading state
      });
      // .finally(() => {
      //   setLoading(false);
      // //   setstate1(false);
      // //   if (!state2) {
      // //     setstate2(true);
      // // }
      //   // localStorage.setItem("synced", "true");
      // });
  }

  useEffect(() => {
    if (!email) return; 
    if(islogin ==="false"){
      // setIsSession(false);
      return;
    }
    
    setLoading(true);
    fetchFolders().then(() => {
      setstate1(false); // Turn off state1 regardless of the fetch result
      setstate2(true);
      setLoading(false);  // Turn on state2 after fetching is done
    });
    
  
  }, [email]);
  
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredFolders(folders);
    } else {
      const lowercasedValue = value.toLowerCase();
      const filtered = folders.filter(folder => folder.folder_name?.toLowerCase().includes(lowercasedValue));

      setFilteredFolders(filtered);
    }
  };

  const handleSortChange = (event) => {
    const newSortOrder = event.target.value;
    setSortOrder(newSortOrder);
    setFilteredFolders(sortFolders(folders, newSortOrder));
  };

  const sortFolders = (folders, order) => {
    return [...folders].sort((a, b) => {
      const dateA = new Date(a.modified_time);
      const dateB = new Date(b.modified_time);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };
  const refreshFolders = () => {
    setLoadingRefresh(true);
    fetchFolders(sortOrder, true).finally(() => setLoadingRefresh(false)); // Assume sortOrder is needed even on refresh
  };

  
  // Dependencies on email and authUser's properties
  if (loading && !initialCheckDone) return <div><CircularProgress /></div>; // Show loading until initial check is done
  if (error) return <div>Error: {error}</div>;
  const handleFolderSelect = (folderId, folderName) => {
    // Check if the currently selected folder is being clicked again to deselect it
    if (selectedFolder && selectedFolder.id === folderId) {
      setSelectedFolder(null); // Deselect if the same folder is clicked again
    } else {
      setSelectedFolder({ id: folderId, name: folderName }); // Select the new folder and store both ID and name
    }
  };

  // if (!initialCheckDone) {
  //   // Show nothing or a loading spinner until the initial check is completed
  //   return <div>Loading...</div>;
  // }

  const handleSync = () => {
    if (selectedFolder) {
      setLoadingSync(true); 
      // Replace with your actual API call to sync folders
      console.log("Syncing folder with ID:", selectedFolder.id);
      console.log("Folder name", selectedFolder.name);
      // After successful sync, you might want to update state or trigger a re-fetch
      fetch ("https://copipeline.veriproc.com/gdrive/syncFolder",{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        b2b_user_uid: authUser.b2b_user_uid,
        email: email,
        folder_name: selectedFolder.name,
        folder_id: selectedFolder.id

      }),
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setIsFolderSynced(true);
          console.log("data.status");
          
        } else {
          throw new Error("API response was not successful.");
        }
      })
      .catch((err) => {
        toast.error(err.message || "Failed to fetch folders.");
      })
      .finally(() => {
        setLoadingSync(false);
        // gatherinfo();
        
      });
    }
  };
  // let windowopen;
  const handleGoogleDriveClick = () => {
    if (authUser && authUser.b2b_user_uid) {
      const url = `https://copipeline.veriproc.com/gdrive/authorize?b2b_user_uid=${authUser.b2b_user_uid}`;

      const width = 900;
      const height = 700;

      // Calculate the position to open the window in the center of the screen
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      // Define features of the window
      const windowFeatures = `width=${width},height=${height},resizable=yes,scrollbars=yes,status=yes,left=${left},top=${top}`;

      const windowopen = window.open(url, "ChildWindow", windowFeatures);
      setWindowOpen(windowopen);
      // setiframeurl(url);
    } else {
      // Handle the error case where authUser or b2b_user_uid is not available
      console.error("User ID is not available.");
      // Optionally, you could alert the user or redirect them to a login or error page.
    }
  };

 

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      {state1 && <StateOneComponent onSyncNow={handleGoogleDriveClick} />}
      {state2 && (
        <Box sx={{  padding: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              marginBottom: 2,
              gap: 1
            }}
          >
              
          
            <Button
              variant="contained"
              onClick={handleSync}
              disabled={!selectedFolder || isFolderSynced}
             
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                ml: "auto", // equivalent to margin-left: auto
                mr: "80px", // margin-right: 80px
                gap: "0.5rem",
                borderRadius: "10px",
                fontWeight: 600,
                whiteSpace: "nowrap",
                transition: "all 0.3s ease 0s",
                backgroundColor: "rgba(231, 181, 61, 1)",
                padding: "7px 20px",
                fontSize: "1.0rem",
                border: "none",
                cursor: "pointer",
                textTransform: 'capitalize',
                
                "&:hover": {
                  backgroundColor: "rgba(231, 181, 61, 0.8)", // Slightly lighter on hover
                },
              }}
            >
             {loadingSync ? <CircularProgress size={20} color="inherit" /> : (isFolderSynced ? 'Folder Synced' : 'Initiate Syncing')}
            </Button>
          </Box>
          <Typography variant="h5" gutterBottom>
            Select the folder which you want to sync
          </Typography>
          <FolderControls
      searchTerm={searchTerm}
      handleSearchChange={handleSearchChange}
      sortOrder={sortOrder}
      handleSortChange={handleSortChange}
      refreshFolders={refreshFolders}
      loadingSort={loadingSort}
      loadingRefresh={loadingRefresh}
    />
            
          {loading ? 
        <CircularProgress />: 
        <FolderList folders={filteredFolders} handleFolderSelect={handleFolderSelect} selectedFolder={selectedFolder} isFolderSynced={isFolderSynced}/>}
        </Box>
      )}
      {state3 && (
  <Box sx={{  padding: 2 }}>
    <Button
              variant="contained"
              onClick={handleSync}
              disabled = {true}
              // sx={{
              //   backgroundColor: selectedFolder ? '#809FFF' : '#ADD8E6',
              //   ':hover': {
              //     backgroundColor: selectedFolder ? '#809FFF' : '#ADD8E6',
              //   },
              //   color: 'white',
              // }}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                ml: "auto", // equivalent to margin-left: auto
                mr: "80px", // margin-right: 80px
                gap: "0.5rem",
                borderRadius: "10px",
                fontWeight: 600,
                whiteSpace: "nowrap",
                transition: "all 0.3s ease 0s",
                backgroundColor: "rgba(231, 181, 61, 1)",
                padding: "7px 20px",
                fontSize: "1.0rem",
                border: "none",
                cursor: "pointer",
                textTransform: 'capitalize',
                "&:hover": {
                  backgroundColor: "rgba(231, 181, 61, 0.8)", // Slightly lighter on hover
                },
              }}
            >
               {loadingSync ? <CircularProgress size={20} color="inherit" /> : ( 'Folder Synced')}
            </Button>
    <Typography variant="h5" gutterBottom>
      Your Google Drive Folders
    </Typography>
    {/* <FolderControls
      searchTerm={searchTerm}
      handleSearchChange={handleSearchChange}
      sortOrder={sortOrder}
      handleSortChange={handleSortChange}
      fetchFolders={fetchFolders}
    /> */}
    <Grid container justifyContent="center">
    {Array.isArray(notsyncfolders) && notsyncfolders.map((folder) => {
        // Check if the folder has been synced
        const isSynced = syncedFolders.some(syncedFolder => syncedFolder.folder_id === folder.folder_id);
        
        return (
          <Grid
            item
            key={folder.folder_id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
          >
            <Paper
              elevation={2}
              sx={{
                position: "relative",
                width: 170,
                height: 170,
                m: 'auto',
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                mt: 4,
                gap: 1,
                borderRadius: "8px",
                bgcolor: isSynced ? "#E8F5E9" : "#FFF", // Use a different background color for synced folders
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
              onClick={() => handleFolderSelect(folder.folder_id, folder.folder_name)}
            >
              {isSynced && (
                <CheckCircleIcon
                  sx={{
                    color: "green", // Green check mark
                    position: "absolute", // Absolute positioning inside the Paper
                    top: 8, // 8px from the top
                    right: 8, // 8px from the right
                    fontSize: "1.5rem", // Icon size
                  }}
                />
              )}
              <FolderIcon sx={{ fontSize: 80 }} />
              <Typography variant="subtitle2" noWrap>
                {folder.folder_name}
              </Typography>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  </Box>
)}
    </Box>
  );
}
);

export default Googledrive;
