import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Booking = () => {
    const [open, setOpen] = useState(false);
    const [selectedTreatment, setSelectedTreatment] = useState(null);
    const [calendlyLoaded, setCalendlyLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // סוגי הטיפולים
    const treatments = [
        {
            id: 1,
            name: 'עיסוי הוליסטי',
            description: 'עיסוי קלאסי מרגיע לכל הגוף...',
            duration: 'שעה',
            price: '350 ₪',
            image: '/massage_room.jpg',
            url: 'https://calendly.com/leahgenish111/30min'
        },
        {
            id: 2,
            name: 'עיסוי הולסטי',
            description: 'עיסוי קלאסי מרגיע לכל הגוף...',
            duration: 'שעה וחצי',
            price: '490 ₪',
            image: '/massage_room.jpg',
            url: 'https://calendly.com/leahgenish111/meet-with-me'
        },
        {
            id: 3,
            name: 'עיסוי הולסטי',
            description: 'עיסוי קלאסי מרגיע לכל הגוף...',
            duration: 'שעתיים',
            price: '490 ₪',
            image: '/massage_room.jpg',
            url: 'https://calendly.com/leahgenish111/meet-with-me-2'
        },
        {
            id: 4,
            name: 'רפלקסולוגיה',
            description: 'טיפול ממוקד בכפות הרגליים...',
            duration: 'שעה',
            price: '280 ₪',
            image: '/reflexsology.jpeg',
            url: 'https://calendly.com/leahgenish111/meet-with-me-1'
        },
        {
            id: 5,
            name: 'נרות הופי',
            description: 'טיפול בדלקות אוזניים וכד׳ באמצעות נרות הופי',
            duration: '',
            price: '150 ₪',
            image: 'https://via.placeholder.com/400x300?text=רפלקסולוגיה',
            url: 'https://calendly.com/leahgenish111/meet-with-me-3'
        },
    ];

    useEffect(() => {
        if (!window.Calendly) {
            const script = document.createElement('script');
            script.src = 'https://assets.calendly.com/assets/external/widget.js';
            script.async = true;
            script.onload = () => {
                setCalendlyLoaded(true);
            };
            document.body.appendChild(script);

            return () => {
                if (document.body.contains(script)) {
                    document.body.removeChild(script);
                }
            };
        } else {
            setCalendlyLoaded(true);
        }
    }, []);

    // אתחול מחדש של ויג'ט Calendly כשהדיאלוג נפתח
    useEffect(() => {
        if (open && selectedTreatment && calendlyLoaded) {
            setIsLoading(true);

            // מאפשר לדיאלוג להיפתח לגמרי לפני טעינת הויג'ט
            const timer = setTimeout(() => {
                try {
                    if (window.Calendly) {
                        // ניקוי קודם של ויג'ט קודם אם יש
                        const container = document.getElementById('calendly-booking-widget');
                        if (container) {
                            while (container.firstChild) {
                                container.removeChild(container.firstChild);
                            }
                        }

                        // אתחול הויג'ט מחדש
                        window.Calendly.initInlineWidget({
                            url: selectedTreatment.url,
                            parentElement: container,
                            prefill: {},
                            utm: {}
                        });
                    }
                } catch (error) {
                    console.error('Error initializing Calendly widget:', error);
                } finally {
                    setIsLoading(false);
                }
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [open, selectedTreatment, calendlyLoaded]);

    const handleOpen = (treatment) => {
        setSelectedTreatment(treatment);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            <Typography variant="h3" component="h1" gutterBottom textAlign="center">
                קביעת תורים
            </Typography>

            <Typography variant="body1" paragraph textAlign="center" sx={{ mb: 4 }}>
                בחרו את הטיפול המתאים לכם וקבעו תור במועד הנוח לכם
            </Typography>

            <Grid container spacing={4}>
                {treatments.map((treatment) => (
                    <Grid item xs={12} sm={6} md={4} key={treatment.id}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 6
                                }
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={treatment.image}
                                alt={treatment.name}
                            />
                            <CardContent sx={{ flexGrow: 1, textAlign: 'right' }}>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    {treatment.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {treatment.duration} | {treatment.price}
                                </Typography>
                                <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
                                    {treatment.description}
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => handleOpen(treatment)}
                                >
                                    קבע תור
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">
                            {selectedTreatment?.name} - קביעת תור
                        </Typography>
                        <IconButton onClick={handleClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ height: '650px', p: 0 }}>
  <iframe
    src={selectedTreatment?.url}
    width="100%"
    height="100%"
    frameBorder="0"
    title={`Book ${selectedTreatment?.name}`}
    style={{ border: 'none' }}
  />
</DialogContent>
            </Dialog>
        </Container>
    );
};

export default Booking;