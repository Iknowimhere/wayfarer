import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../context/AuthContext';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Stack,
  Divider,
  IconButton,
} from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TimelineIcon from '@mui/icons-material/Timeline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const featuredLocations = [
  { name: 'Paris, France', image: '/src/assets/paris.jpg', description: 'City of Love and Lights' },
  { name: 'Tokyo, Japan', image: '/src/assets/tokyo.jpg', description: 'Where Tradition Meets Future' },
  { name: 'New York, USA', image: '/src/assets/newyork.jpg', description: 'The City That Never Sleeps' },
  { name: 'Sydney, Australia', image: '/src/assets/sydney.jpg', description: 'Harbor City Paradise' },
  { name: 'Dubai, UAE', image: '/src/assets/dubai.jpg', description: 'Modern Desert Miracle' },
];

const features = [
  {
    icon: <FlightTakeoffIcon fontSize="large" />,
    title: 'Smart Travel Planning',
    description: 'AI-powered itinerary creation tailored to your preferences'
  },
  {
    icon: <LocationOnIcon fontSize="large" />,
    title: 'Popular Destinations',
    description: 'Explore top-rated locations around the world'
  },
  {
    icon: <TimelineIcon fontSize="large" />,
    title: 'Customizable Schedules',
    description: 'Flexible planning that fits your timeline'
  },
  {
    icon: <AttachMoneyIcon fontSize="large" />,
    title: 'Budget Friendly',
    description: 'Options for every budget range'
  },
];

const Welcome = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/home');
    }
  }, [token, navigate]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      
      {/* Hero Section */}
      <Box
        sx={{
          height: { xs: '70vh', md: 'calc(100vh - 64px)' },
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/src/assets/welcome.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom 
                sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
                Plan Your Perfect Journey
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Create custom travel itineraries for free with our AI-powered platform
              </Typography>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                size="large"
                startIcon={<ExploreIcon />}
                sx={{
                  bgcolor: 'success.main',
                  '&:hover': { bgcolor: 'success.dark' },
                  py: 1.5,
                  px: 4,
                }}
              >
                Start Planning
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Why Choose Wayfarer?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    textAlign: 'center', 
                    boxShadow: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    minHeight: 250, // Set minimum height
                  }}
                >
                  <CardContent sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100%',
                    p: 3,
                    gap: 2
                  }}>
                    <Box sx={{ 
                      color: 'primary.main', 
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 60 // Fixed height for icon container
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 1,
                        flexGrow: 0 
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Locations */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Featured Destinations
          </Typography>
          <Typography variant="subtitle1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
            Create free itineraries for these popular locations
          </Typography>
          <Grid container spacing={3}>
            {featuredLocations.map((location, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={location.image}
                    alt={location.name}
                    sx={{ bgcolor: 'grey.300' }} // Placeholder color
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {location.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {location.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', py: 6, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                About Wayfarer
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your AI-powered travel companion for creating perfect itineraries. Plan your next adventure with ease.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Login
                </Link>
                <Link to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Sign Up
                </Link>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Connect With Us
              </Typography>
              <Stack direction="row" spacing={2}>
                <IconButton color="primary">
                  <FacebookIcon />
                </IconButton>
                <IconButton color="primary">
                  <TwitterIcon />
                </IconButton>
                <IconButton color="primary">
                  <InstagramIcon />
                </IconButton>
                <IconButton color="primary">
                  <LinkedInIcon />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Wayfarer. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Welcome;