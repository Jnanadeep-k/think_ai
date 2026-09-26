import { ThemeProvider } from '../../ThemeContext';
import CodePlayground from '../CodePlayground';

const meta = {
  title: 'Playground/CodePlayground',
  component: CodePlayground,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;

export const Default = {};