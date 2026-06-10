import { createTheme, type MantineColorsTuple } from '@mantine/core';

// Volleyball-energetic palette: deep court navy + electric jaguar amber.
const court: MantineColorsTuple = [
  '#eef1ff', '#dce0f5', '#b6bce4', '#8d96d4', '#6b76c6',
  '#5562bf', '#4a58bc', '#3b49a6', '#333f94', '#283682',
];

const flame: MantineColorsTuple = [
  '#fff4e2', '#ffe6c6', '#ffcb8d', '#ffae4f', '#ff961d',
  '#ff8a05', '#ff7e00', '#e36c00', '#cb5f00', '#b15000',
];

export const theme = createTheme({
  primaryColor: 'flame',
  colors: { court, flame },
  defaultRadius: 'lg',
  fontFamily:
    "'Trebuchet MS', 'Segoe UI', system-ui, -apple-system, sans-serif",
  headings: {
    fontWeight: '900',
    sizes: {
      h1: { fontSize: '2.4rem', lineHeight: '1.1' },
    },
  },
  components: {
    Button: {
      defaultProps: { size: 'lg', radius: 'xl' },
    },
  },
});
