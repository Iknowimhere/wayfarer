import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../context/AuthContext';
import { Box, Button, Container, Typography } from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';

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
      <Container
        sx={{
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          backgroundImage: `url('/src/assets/welcome.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Wayfarer!
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          We are glad to have you here. Explore our features and enjoy your stay!
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
          }}
        >
          Explore
        </Button>
      </Container>
    </Box>
  );
};

export default Welcome;