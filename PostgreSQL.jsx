import React, { useState, useEffect } from "react";
import { GoEye, GoEyeClosed } from "react-icons/go";
import AuthContext from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Link,
} from "@mui/material"; // Importing TextField and other components from Material-UI
import MyPostGreInfo from "./MyPostGreInfo";

const PostgreSQL = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        host: "",
        database: "",
        datatype: "1", // Default to mySQL
    });
    const [mySqlCard, setMySqlCard] = useState(false);
    const { authUser } = React.useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [userName, setUserName] = useState("");
    const [databaseName, setDatabaseName] = useState("");
    const [host, setHost] = useState("");
    const [InputCard, setInputCard] = useState(false);
    const [mainLoading, setMainLoading] = useState(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    useEffect(() => {
        checkUserIntegration();
    }, []);

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const checkUserIntegration = async () => {
        setMainLoading(true)
        try {
            const response = await fetch(
                "https://copipeline.veriproc.com/yogGPT/sql_conneced_info",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        b2b_user_uid: authUser.b2b_user_uid,
                        dbType: 1,
                    }),
                }
            );
            const result = await response.json();

            if (result.status === "success") {
                if (result.data !== null) {
                    setMainLoading(false)
                    setMySqlCard(true);
                    setInputCard(false);
                    setUserName(result.data.username);
                    setDatabaseName(result.data.database_name);
                    setHost(result.data.host);

                } else {
                    setMainLoading(false);
                    setInputCard(true);
                    setMySqlCard(false);
                }
            } else {
                throw new Error("Oops! please reload the page");
            }
        } catch (err) {
            toast.error(err.message || "Failed to check integration status.");
            // Assuming you show the form if not integrated
        } finally {
            setMainLoading(false)
        }
    };

    const handleConnect = () => {
        console.log("api call");
        setLoading(true);
        const apiUrl = "https://copipeline.veriproc.com/yogGPT/sql_db_sync";
        const { username, password, host, database, datatype } = formData;

        // Determine dbType based on datatype

        // Prepare data for API call
        const requestData = {
            b2b_user_uid: authUser.b2b_user_uid,
            project_id: authUser.project_id,
            username,
            password,
            host,
            database,
            datatype,
        };

        // Make API call
        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        })
            .then((response) => response.json())
            .then((data) => {
                if(data.status ==="success"){
                    setLoading(false);
                    toast.success(data.data);
                   
                    }else{
                        toast.error(data.data);
                        setLoading(false);
                    }
            })
            .catch((error) => {
                // Handle errors if any
                setLoading(false);
                toast.error(error);
                console.log(error);
            });
    };

    return (
        <div>
            {mainLoading && (
                <div className="flex justify-center items-center mt-[50px]">
                    <CircularProgress
                        size={40}
                        style={
                            {
                                // Adjust height as needed
                            }
                        }
                    />
                </div>
            )}
            {InputCard && (
                <Container
                    maxWidth="lg"
                    sx={{
                        display: "flex",
                        height: "650px",
                        alignItems: "center", // This centers the box vertically
                        justifyContent: "center",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            my: 4,
                            padding: 3,
                            boxShadow: 3,
                            borderRadius: 2,
                            bgcolor: "background.paper",
                            width: "50%",
                            height: "80%",
                        }}
                    >
                        <Typography variant="h5" component="h1" gutterBottom>
                            PostgreSQL Database Connection
                        </Typography>
                        <form noValidate sx={{ mt: 2 }}>
                            <TextField
                                margin="normal"
                                required
                                style={{ width: "70%" }}
                                label="User Name"
                                name="username"
                                autoComplete="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                variant="outlined"
                            />
                            <TextField
                                margin="normal"
                                required
                                style={{ width: "70%" }}
                                label="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleInputChange}
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <Button
                                            onClick={
                                                handleTogglePasswordVisibility
                                            }
                                            sx={{ p: 0 }}
                                        >
                                            {showPassword ? (
                                                <GoEyeClosed />
                                            ) : (
                                                <GoEye />
                                            )}
                                        </Button>
                                    ),
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                style={{ width: "70%" }}
                                label="Host"
                                name="host"
                                autoComplete="hostname"
                                value={formData.host}
                                onChange={handleInputChange}
                                variant="outlined"
                            />
                            <TextField
                                margin="normal"
                                required
                                style={{ width: "70%" }}
                                label="Database"
                                name="database"
                                autoComplete="off"
                                value={formData.database}
                                onChange={handleInputChange}
                                variant="outlined"
                            />
                        </form>
                        <Button
                            type="submit"
                            variant="contained"
                            onClick={handleConnect}
                            sx={{
                                mt: "20px",
                                width: "50%",
                                display: "flex",
                                position: "relative",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                // Ensure the button fills the container
                                bgcolor: "rgba(231, 181, 61, 1)",
                                "&:hover": {
                                    bgcolor: "rgba(231, 181, 61, 0.9)", // Slightly lighter on hover
                                },
                                position: "relative",

                                textTransform: "capitalize",
                            }}
                        >
                            Connect
                            {loading && (
                                <CircularProgress
                                    size={15}
                                    sx={{
                                        color: "primary.main",
                                        ml: "10px",
                                        // Half of the size to center it horizontally
                                    }}
                                />
                            )}
                        </Button>
                    </Box>
                </Container>
            )}

            {mySqlCard && (
                <MyPostGreInfo
                    userName={userName}
                    databaseName={databaseName}
                    host={host}
                />
            )}
        </div>
    );
};

export default PostgreSQL;
