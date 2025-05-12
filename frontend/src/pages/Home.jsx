import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import useAuth from "../context/AuthContext";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { format } from 'date-fns';

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
  Stack,
  ListItemIcon,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "../components/Navbar";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
// import { CircularProgress } from '@mui/material';

const capitalizeWords = (str) => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const Home = () => {
  const { token } = useAuth();
  // const { itineraries, setItineraries } = useItinerary();
    const [itineraries, setItineraries] = useState([]);
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
  const [isLoading, setIsLoading] = useState(true);

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

  // Update your fetchItineraries function
  const fetchItineraries = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/itineraries", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItineraries(response.data);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add this useEffect to fetch initial data
  useEffect(() => {
    if (token) {
      fetchItineraries();
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, location: query });
  };

  const handleLocationChange = (e) => {
    setQuery(e.target.value); // Update query state
    setActiveIndex(-1);
  };

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/itineraries", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Clear form data
      setFormData({
        travelType: "",
        location: "",
        startDate: "",
        endDate: "",
        budget: "",
      });
      setQuery(""); // Clear location query
      // Fetch updated list
      await fetchItineraries();
      alert("Itinerary created successfully!");
    } catch (error) {
      console.error("Error creating itinerary:", error);
    }
  };

  const handleSelect = (description) => {
    setQuery(description);
    setFormData(prev => ({ ...prev, location: description }));
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

  // Update the handleDelete function
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/itineraries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Fetch updated list
      await fetchItineraries();
      alert("Itinerary deleted successfully!");
    } catch (error) {
      console.error("Error deleting itinerary:", error);
    }
  };

  const suggestionStyles = {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'background.paper',
    boxShadow: 3,
    borderRadius: 1,
    zIndex: 1000,
    mt: 0.5,
    maxHeight: 200,
    overflowY: 'auto',
  };

  return token ? (
   <>
   <Navbar />
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Form Section - Left Side */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <TravelExploreIcon color="primary" />
                <Typography variant="h6">Create Itinerary</Typography>
              </Stack>
              
              <form onSubmit={handleSubmit} autoComplete="off">
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel id="travel-type-label">
                    <FlightTakeoffIcon sx={{ mr: 1, fontSize: 'small' }} />
                    Travel Type
                  </InputLabel>
                  <Select
                    labelId="travel-type-label"
                    label="Travel Type"
                    name="travelType"
                    value={formData.travelType}
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="">Select a Travel Type</MenuItem>
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

                <Box sx={{ position: 'relative', mt: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Location"
                    name="location"
                    value={query}
                    onChange={handleLocationChange}
                    onKeyDown={handleKeyDown}
                    required
                    InputProps={{
                      startAdornment: <LocationOnIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                  {suggestions.length > 0 && (
                    <Paper sx={suggestionStyles}>
                      <List dense>
                        {suggestions.map((suggestion, index) => (
                          <ListItem
                            key={index}
                            button
                            selected={index === activeIndex}
                            onClick={() => handleSelect(suggestion)}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'action.hover',
                              },
                            }}
                          >
                            <ListItemIcon>
                              <LocationOnIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={suggestion} />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  )}
                </Box>

                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <TextField
                    size="small"
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: <DateRangeIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                    InputLabelProps={{ 
                      shrink: true,
                      sx: { ml: 4 }
                    }}
                    sx={{
                      '& input': {
                        cursor: 'pointer',
                        color: 'inherit'
                      },
                      '& input[type="date"]::-webkit-calendar-picker-indicator': {
                        position: 'absolute',
                        right: 0,
                        opacity: 0,
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer'
                      }
                    }}
                  />
                  <TextField
                    size="small"
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: <DateRangeIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                    InputLabelProps={{ 
                      shrink: true,
                      sx: { ml: 4 }
                    }}
                    sx={{
                      '& input': {
                        cursor: 'pointer',
                        color: 'inherit'
                      },
                      '& input[type="date"]::-webkit-calendar-picker-indicator': {
                        position: 'absolute',
                        right: 0,
                        opacity: 0,
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer'
                      }
                    }}
                  />
                </Stack>

                <TextField
                  fullWidth
                  size="small"
                  label="Budget"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    startAdornment: <CurrencyRupeeIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                  sx={{ mt: 3 }}
                />

                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  sx={{ mt: 2 }}
                  startIcon={<AddCircleOutlineIcon />}
                >
                  Create Itinerary
                </Button>
              </form>
            </Paper>
          </Grid>

          {/* Itineraries List - Right Side */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <ListAltIcon color="primary" />
                <Typography variant="h6">Saved Itineraries</Typography>
              </Stack>

              {isLoading ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <CircularProgress />
                </Box>
              ) : Array.isArray(itineraries) && itineraries.length > 0 ? (
                <List>
                  {itineraries.map((itinerary, index) => (
                    <ListItem
                      key={`itinerary-${itinerary._id || index}`}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        bgcolor: 'background.default',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDelete(itinerary._id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle1"
                            sx={{ display: 'flex', alignItems: 'center' }}
                          >
                            <LocationOnIcon sx={{ mr: 1 }} />
                            {capitalizeWords(itinerary?.location) || 'No Location'}
                          </Typography>
                        }
                        secondary={
                          <Stack spacing={0.5} mt={1}>
                            <Typography
                              variant="body2"
                              sx={{ display: 'flex', alignItems: 'center' }}
                            >
                              <FlightTakeoffIcon sx={{ mr: 1, fontSize: 'small' }} />
                              {capitalizeWords(itinerary?.travelType) || 'No Type'}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ display: 'flex', alignItems: 'center' }}
                            >
                              <DateRangeIcon sx={{ mr: 1, fontSize: 'small' }} />
                              {itinerary?.startDate && itinerary?.endDate
                                ? `${format(new Date(itinerary.startDate), 'dd MMM yyyy')} to ${format(new Date(itinerary.endDate), 'dd MMM yyyy')}`
                                : 'No Date'}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ display: 'flex', alignItems: 'center' }}
                            >
                              <CurrencyRupeeIcon sx={{ mr: 1, fontSize: 'small' }} />
                              {Number(itinerary?.budget).toLocaleString('en-IN') || '0'}
                            </Typography>
                          </Stack>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography color="text.secondary">
                    No itineraries found.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
   </>
  ) : (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    </Box>
  );
};

export default Home;
