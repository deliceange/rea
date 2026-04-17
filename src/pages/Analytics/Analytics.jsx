import { Box, Typography, Grid, useTheme } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useThemeContext } from '../../context/ThemeContext';
import { rentalStats } from '../../data/mockData';
import '../../styles/main.scss';

const Analytics = () => {
  const theme = useTheme();
  const { isDark } = useThemeContext();

  const colors = {
    primary: isDark ? '#90caf9' : '#1976d2',
    secondary: isDark ? '#f50057' : '#dc004e',
    text: isDark ? '#ffffff' : '#212121',
    grid: isDark ? '#333' : '#e0e0e0',
  };

  const pieColors = ['#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2'];

  return (
    <Box className="page-container">
      <Typography variant="h4" className="page-title" sx={{ mb: { xs: 2, sm: 3 } }}>
        Analytics
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Popular Genres - Pie Chart */}
        <Grid item xs={12} md={6}>
          <Box className="chart-container">
            <Typography variant="h6" gutterBottom>
              Popular Genres
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={rentalStats.popularGenres}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {rentalStats.popularGenres.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        {/* Rental Frequency - Line Chart */}
        <Grid item xs={12} md={6}>
          <Box className="chart-container">
            <Typography variant="h6" gutterBottom>
              Rental Frequency
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rentalStats.rentalFrequency}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis dataKey="month" stroke={colors.text} />
                <YAxis stroke={colors.text} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rentals"
                  stroke={colors.primary}
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        {/* Late Returns - Bar Chart */}
        <Grid item xs={12} md={6}>
          <Box className="chart-container">
            <Typography variant="h6" gutterBottom>
              Late Return Statistics
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rentalStats.lateReturns}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis dataKey="month" stroke={colors.text} />
                <YAxis stroke={colors.text} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
                <Legend />
                <Bar
                  dataKey="late"
                  name="Late Returns"
                  fill={colors.secondary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        {/* Customer Activity - Pie Chart */}
        <Grid item xs={12} md={6}>
          <Box className="chart-container">
            <Typography variant="h6" gutterBottom>
              Customer Activity
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={rentalStats.customerActivity}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {rentalStats.customerActivity.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? colors.primary : colors.secondary}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;