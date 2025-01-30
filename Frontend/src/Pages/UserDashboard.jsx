import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Modal, Typography, Grid, Card, CardContent, Box, Stack } from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import "./UserDashboard.css"; // Import CSS for styling

const dummyForms = [
  { id: 1, title: "Personal Details", description: "Fill in your personal information.", status: "Pending" },
  { id: 2, title: "Staff Leave Form", description: "Fill in your information.", status: "Pending" },

  // Add more forms if needed
];

const UserDashboard = () => {
  const [selectedForm, setSelectedForm] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleTileClick = (form) => {
    setSelectedForm(form);
  };

  const handleCloseModal = () => {
    setSelectedForm(null);
  };

  const handleUpdateClick = () => {
    navigate(`/updateform/${id}`);
  };

  const handleSubmitClick = () => {
    navigate(`/histryform/${id}`);
  };

  const handleSignOut = () => {
    // Add your sign-out logic here
    console.log("User signed out");
    navigate("/userlogin"); // Navigate to the login page
  };

  return (
    <Box className="dashboard-container" sx={{ padding: 3 }}>
      <Typography variant="h4" className="dashboard-title" sx={{ marginBottom: 3, textAlign: "center", fontWeight: "bold" }}>
        Please Fill All the Forms
      </Typography>

      <Button
        variant="outlined"
        color="secondary"
        startIcon={<LogoutIcon />}
        onClick={handleSignOut}
        sx={{ position: "absolute", top: 20, right: 20 }}
      >
        Sign Out
      </Button>

      <Grid container spacing={2} sx={{ marginTop: 3 }}>
        {dummyForms.map((form) => (
          <Grid item xs={12} sm={6} md={4} key={form.id}>
            <Card
              className={`form-tile ${form.status === "Completed" ? "completed" : "pending"}`}
              onClick={() => handleTileClick(form)}
              sx={{
                padding: 2,
                cursor: "pointer",
                backgroundColor: form.status === "Completed" ? "#e0f7fa" : "#fff3e0",
                boxShadow: 3,
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" className="form-title" sx={{ fontWeight: "bold" }}>
                  {form.title}
                </Typography>
                <Typography variant="body2" className="form-description" sx={{ color: "text.secondary", marginBottom: 2 }}>
                  {form.description}
                </Typography>
                <Typography variant="body2" className="form-status" sx={{ fontWeight: "bold" }}>
                  {form.status === "Completed" ? "✅ Completed" : "🕒 Pending"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for displaying selected form details */}
      <Modal
        open={Boolean(selectedForm)}
        onClose={handleCloseModal}
        aria-labelledby="form-modal-title"
        aria-describedby="form-modal-description"
      >
        <Box sx={{ width: 400, margin: "auto", padding: 3, backgroundColor: "white", borderRadius: 2 }}>
          <Typography id="form-modal-title" variant="h5" sx={{ marginBottom: 2 }}>
            {selectedForm?.title}
          </Typography>
          <Typography id="form-modal-description" variant="body1" sx={{ marginBottom: 2 }}>
            {selectedForm?.description}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            <strong>Status: </strong> {selectedForm?.status}
          </Typography>

          {/* Update button appears only if status is Completed */}
          <Stack direction="row" spacing={2}>
            {selectedForm?.status === "Completed" && (
              <Button variant="contained" color="primary" onClick={handleUpdateClick}>
                Update
              </Button>
            )}
            {selectedForm?.status === "Pending" && (
              <Button variant="contained" color="success" onClick={handleSubmitClick}>
                Submit
              </Button>
            )}
          </Stack>

          <Button variant="outlined" color="error" onClick={handleCloseModal} sx={{ marginTop: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default UserDashboard;
