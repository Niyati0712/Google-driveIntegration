import React from "react";
import {
    Box,
    Button,
    Card,
    Container,
    CardContent,
    CardHeader,
    Typography,
    TextField,
    InputAdornment,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { green, grey } from "@mui/material/colors";
import toast from "react-hot-toast";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const MyPostGreInfo = ({
    userName,
    databaseName,
    host
}) => {
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: "flex",
                height: "100vh",
                alignItems: "center", // This centers the box vertically
                justifyContent: "center",
            }}
        >
            <Card
                raised
                sx={{
                    width: "100%",
                    minHeight:"500px",
                    backgroundColor: grey[50],
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius:"20px",
                    p: 2,
                   
                }}
            >
                <CardHeader
                    title="SQL Database Synced Successfully!"
                    subheader="Following are your details"
                    titleTypographyProps={{
                        align: "center",
                        color: green[800],
                        fontSize:22,
                    }}
                    subheaderTypographyProps={{ align: "center" }}
                    avatar={
                        <CheckCircleIcon
                            sx={{ fontSize: 50, color: green[500] }}
                        />
                    }
                    sx={{ bgcolor: grey[100],my:"20px" }}
                />
                <CardContent>
                    <TextField
                        fullWidth
                        label="User Name"
                        value={userName}
                        margin="normal"
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <ContentCopyIcon
                                        sx={{
                                            cursor: "pointer",
                                            color: grey[700],
                                            width: "80%",
                                        }}
                                        onClick={() =>
                                            copyToClipboard(userName)
                                        }
                                    />
                                </InputAdornment>
                            ),
                        }}
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Database Name"
                        value={databaseName}
                        margin="normal"
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <ContentCopyIcon
                                        sx={{
                                            cursor: "pointer",
                                            color: grey[700],
                                            width: "80%",
                                        }}
                                        onClick={() =>
                                            copyToClipboard(databaseName)
                                        }
                                    />
                                </InputAdornment>
                            ),
                        }}
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Host"
                        value={host}
                        margin="normal"
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <ContentCopyIcon
                                        sx={{
                                            cursor: "pointer",
                                            color: grey[700],
                                            width: "80%",
                                        }}
                                        onClick={() =>
                                            copyToClipboard(host)
                                        }
                                    />
                                </InputAdornment>
                            ),
                        }}
                        variant="outlined"
                    />
                    
                </CardContent>
            </Card>
        </Container>
    );
};

export default MyPostGreInfo;
