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
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { itenaries, setItenaries } = useItinerary();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    travelType: "",
    location: "",
    startDate: "",
    endDate: "",
    budget: "",
  });
  // console.log(formData);


  useEffect(() => {
    if (!token) {
      return navigate("/login");
    }
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value,location: query });
  };

  const handleLocationChange = async (e) => {
    const input = e.target.value;
    setActiveIndex(-1);

    if (input.length > 1) {
      try {
        const res = await axios.get('/itenaries/autocomplete', {
          params: { location: input },
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(res);
        
        setSuggestions(res.data);
      } catch (err) {
        console.error('Error fetching suggestions', err);
      }
    } else {
      setSuggestions([]);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/itenaries", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);

      setItenaries((prev) => [...prev, response.data]);
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
    if (e.key === 'ArrowDown') {
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      const selected = suggestions[activeIndex];
      handleSelect(selected);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/itenaries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItenaries((prev) => prev.filter((itenary) => itenary._id !== id));
      alert("Itinerary deleted successfully!");
    } catch (error) {
      console.error("Error deleting itinerary:", error);
    }
  };

  return (
    <Box>
      {/* Navbar Section - Full Width */}
      <Box sx={{ width: "100%", marginBottom: 4 }}>
        <Navbar />
      </Box>

      {/* Content Section */}
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Form Section */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                backgroundColor: "#1e1e2f",
                color: "#fff",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Create a Travel Itinerary
              </Typography>
              <form onSubmit={handleSubmit}>
                <FormControl
                  fullWidth
                  margin="normal"
                  sx={{ marginBottom: 2 }}
                >
                  <InputLabel
                    id="travel-type-label"
                    sx={{ color: '#fff' }}
                  >
                    Travel Type
                  </InputLabel>
                  <Select
                    labelId="travel-type-label"
                    label="Travel Type"
                    name="travelType"
                    value={formData.travelType}
                    onChange={handleInputChange}
                    required
                    sx={{
                      color: '#fff',
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '.MuiSvgIcon-root': {
                        color: '#fff',
                      }
                    }}
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
                  InputLabelProps={{ style: { color: "#fff" } }}
                  sx={{ input: { color: "#fff" }, marginBottom: 2 }}
                />
                {suggestions.length > 0 && (
                  <ul style={{ border: '1px solid #ccc', listStyle: 'none', padding: 0, margin: 0,position: 'absolute', backgroundColor: 'white', zIndex: 1 }}>
                    {suggestions.map((sug, index) => (
                      <li
                        key={sug}
                        onClick={() => handleSelect(sug)}
                        style={{
                          padding: '8px',
                          cursor: 'pointer',
                          color: '#000',
                          backgroundColor: index === activeIndex ? '#f0f0f0' : 'white',
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
                  InputLabelProps={{
                    shrink: true,
                    style: { color: "#fff" },
                  }}
                  sx={{
                    input: {
                      color: "#fff",
                      '&::-webkit-calendar-picker-indicator': {
                        filter: 'invert(0.8)'
                      }
                    },
                    marginBottom: 2
                  }}
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
                  InputLabelProps={{
                    shrink: true,
                    style: { color: "#fff" },
                  }}
                  sx={{
                    input: {
                      color: "#fff",
                      '&::-webkit-calendar-picker-indicator': {
                        filter: 'invert(0.8)'
                      }
                    },
                    marginBottom: 2
                  }}
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
                  InputLabelProps={{ style: { color: "#fff" } }}
                  sx={{ input: { color: "#fff" }, marginBottom: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#4caf50",
                    "&:hover": { backgroundColor: "#45a049" },
                  }}
                >
                  Create Itinerary
                </Button>
              </form>
            </Paper>
          </Grid>

          {/* Itineraries List */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ padding: 3 }}>
              <Typography variant="h5" gutterBottom>
                Saved Itineraries
              </Typography>
              {itenaries?.length > 0 ? (
                <List>
                  {itenaries?.map((itenary, index) => (
                    <ListItem
                      key={itenary._id}
                      sx={{
                        borderBottom: "1px solid #ddd",
                        paddingBottom: 2,
                        marginBottom: 2,
                      }}
                    >
                      <ListItemText
                        primary={`Itinerary ${index + 1}`}
                        secondary={
                          <>
                            <Typography variant="body2">
                              <strong>Days:</strong>
                            </Typography>
                            <>
                              <ul>
                                {itenary?.days?.map((day, dayIndex) => (
                                  <li key={dayIndex}>
                                    <strong>Date:</strong> {day.date} <br />
                                    <strong>Plan:</strong> {day.plan.join(", ")} <br />
                                    <strong>Cost:</strong> ${day.cost} <br />
                                    <strong>Tip:</strong> {day.tip}
                                  </li>
                                ))}
                              </ul>
                            </>

                            <Typography variant="body2">
                              <strong>Total:</strong>
                            </Typography>
                            <ul>
                              <li>Stay: ${itenary?.total?.stay}</li>
                              <li>Food: ${itenary?.total?.food}</li>
                              <li>Travel: ${itenary?.total?.travel}</li>
                            </ul>
                            <Typography variant="body2">
                              <strong>Tips:</strong> {itenary?.tips?.join(", ")}
                            </Typography>
                          </>
                        }
                      />
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(itenary?._id)}
                        sx={{ color: "#ff4d4d" }}
                      >
                        <DeleteIcon />
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
  );
};

export default Home;
