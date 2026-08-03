import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Button } from '@mui/material';
import { FaChartBar } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';

function Reports() {
  const theme = useTheme();

  const reportTypes = [
    { name: 'Daily Dust Report', description: 'Summary of daily dust levels' },
    { name: 'Weekly Zone Analysis', description: 'Analysis of zone performance' },
    { name: 'Monthly Compliance', description: 'Compliance metrics for the month' },
  ];

  return (
    <Box 
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        bgcolor: theme.palette.background.default,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Paper 
        sx={{ 
          p: 3, 
          borderRadius: '14px', 
          bgcolor: '#1a1a1a', 
          maxWidth: '800px', 
          width: '100%' 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FaChartBar size={30} color={theme.palette.primary.main} />
          <Typography variant="h5" sx={{ ml: 2, color: theme.palette.text.primary, fontWeight: 'bold' }}>
            Reports
          </Typography>
        </Box>
        <List>
          {reportTypes.map((report, index) => (
            <ListItem key={index} sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
              <ListItemText
                primary={report.name}
                secondary={report.description}
                primaryTypographyProps={{ color: theme.palette.text.primary, fontWeight: 'medium' }}
                secondaryTypographyProps={{ color: theme.palette.text.secondary }}
              />
              <Button
                className="btn-modern"
                variant="contained"
                size="small"
                sx={{ bgcolor: theme.palette.primary.main }}
              >
                Generate
              </Button>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default Reports;