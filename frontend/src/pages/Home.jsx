import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import useAuth from "../context/AuthContext";
import useItinerary from "../context/ItenaryContent";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "../components/Navbar";

const Home = () => {
  const { token } = useAuth();
  const { itineraries, setItineraries } = useItinerary();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [debouncedInput, setDebouncedInput] = useState(""); // State for debounced input
  const [formData, setFormData] = useState({
    travelType: "",
    location: "",
    startDate: "",
    endDate: "",
    budget: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  // Debounce the input value
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(query); // Update debounced input after delay
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler); // Clear timeout on cleanup
    };
  }, [query]);

  // Fetch suggestions when debounced input changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedInput.length > 1) {
        try {
          const res = await axios.get("/itineraries/autocomplete", {
            params: { location: debouncedInput },
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(res);
          
          setSuggestions(res.data);
        } catch (err) {
          console.error("Error fetching suggestions", err);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedInput, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, location: query });
  };

  const handleLocationChange = (e) => {
    setQuery(e.target.value); // Update query state
    setActiveIndex(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/itineraries", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItineraries((prev) => [...prev, response.data]);
      alert("Itinerary created successfully!");
    } catch (error) {
      console.error("Error creating itinerary:", error);
    }
  };

  const handleSelect = (description) => {
    setQuery(description);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      const selected = suggestions[activeIndex];
      handleSelect(selected);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/itineraries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItineraries((prev) => prev.filter((itinerary) => itinerary._id !== id));
      alert("Itinerary deleted successfully!");
    } catch (error) {
      console.error("Error deleting itinerary:", error);
    }
  };

  return token ? (
   <>
   <Navbar></Navbar>
    <Box>
      <Container maxWidth="xl" sx={{ marginTop: 4 }}>
        <Grid container spacing={4}>
          {/* Form Section */}
          <Grid>
            <Paper elevation={3} sx={{ padding: 3 }}>
              <Typography variant="h5" gutterBottom>
                Create a Travel Itinerary
              </Typography>
              <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="travel-type-label">Travel Type</InputLabel>
                  <Select
                    labelId="travel-type-label"
                    label="Travel Type"
                    name="travelType"
                    value={formData.travelType}
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="">Select a travel type</MenuItem>
                    <MenuItem value="solo">Solo Travel</MenuItem>
                    <MenuItem value="family">Family Vacation</MenuItem>
                    <MenuItem value="business">Business Trip</MenuItem>
                    <MenuItem value="romantic">Romantic Getaway</MenuItem>
                    <MenuItem value="adventure">Adventure Travel</MenuItem>
                    <MenuItem value="cultural">Cultural Experience</MenuItem>
                    <MenuItem value="luxury">Luxury Vacation</MenuItem>
                    <MenuItem value="budget">Budget Travel</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={query}
                  onChange={handleLocationChange}
                  onKeyDown={handleKeyDown}
                  margin="normal"
                  required
                  InputLabelProps={{ style: { color: "black" } }}
                  sx={{ input: { color: "black" }, marginBottom: 2 }}
                />
                {suggestions.length > 0 && (
                  <ul
                    style={{
                      border: "1px solid #ccc",
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      position: "absolute",
                      backgroundColor: "#ffffff",
                      zIndex: 1000,
                      opacity: 1,
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {suggestions.map((sug, index) => (
                      <li
                        key={sug}
                        onClick={() => handleSelect(sug)}
                        style={{
                          padding: "8px",
                          cursor: "pointer",
                          backgroundColor: index === activeIndex ? "#f0f0f0" : "#fff",
                        }}
                      >
                        {sug}
                      </li>
                    ))}
                  </ul>
                )}
                <TextField
                  fullWidth
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Budget"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
                <Button type="submit" variant="contained" fullWidth>
                  Create Itinerary
                </Button>
              </form>
            </Paper>
          </Grid>

          {/* Itineraries List */}
          <Grid>
            <Paper elevation={3} sx={{ padding: 3 }}>
              <Typography variant="h5" gutterBottom>
                Saved Itineraries
              </Typography>
              {itineraries?.length > 0 ? (
                <List>
                  {itineraries.map((itinerary) => (
                    <ListItem
                      key={itinerary._id}
                      sx={{
                        borderBottom: "1px solid #ddd",
                        paddingBottom: 2,
                        marginBottom: 2,
                      }}
                    >
                      <ListItemText
                        primary={`Itinerary: ${itinerary.location}`}
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              <strong>Travel Type:</strong> {itinerary.travelType}
                            </Typography>
                            <br />
                            <Typography variant="body2" component="span">
                              <strong>Start Date:</strong> {itinerary.startDate}
                            </Typography>
                            <br />
                            <Typography variant="body2" component="span">
                              <strong>End Date:</strong> {itinerary.endDate}
                            </Typography>
                            <br />
                            <Typography variant="body2" component="span">
                              <strong>Budget:</strong> ${itinerary.budget}
                            </Typography>
                          </>
                        }
                      />
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(itinerary._id)}
                      >
                        <DeleteIcon />
                        {/* Delete */}
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No itineraries found.</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
   </>
  ) : (
    <p>Loading...</p>
  );
};

export default Home;
