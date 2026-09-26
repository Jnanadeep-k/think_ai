import { fn } from 'storybook/test';
import CourseCard from '../CourseCard';

const meta = {
  title: 'Common/CourseCard',
  component: CourseCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    onEnroll: fn(),
  },
  argTypes: {
    title: { control: 'text' },
    instructor: { control: 'text' },
    level: {
      control: 'select',
      options: ['Beginner', 'Intermediate', 'Advanced'],
    },
    duration: { control: 'text' },
    lessons: { control: 'number' },
    rating: { control: 'number' },
    studentsCount: { control: 'number' },
    price: { control: 'text' },
    progress: { control: { type: 'range', min: 0, max: 100 } },
  },
};

export default meta;

export const Catalog = {
  args: {
    title: 'React for Front-End Developers',
    instructor: 'Maya Chen',
    level: 'Intermediate',
    duration: '6h 30m',
    lessons: 42,
    rating: 4.8,
    studentsCount: 12480,
    price: '$49',
  },
};

export const Free = {
  args: {
    title: 'Intro to Version Control with Git',
    instructor: 'Sam Okafor',
    level: 'Beginner',
    duration: '2h 15m',
    lessons: 18,
    rating: 4.6,
    studentsCount: 34210,
    price: null,
  },
};

export const InProgress = {
  args: {
    title: 'Advanced TypeScript Patterns',
    instructor: 'Priya Raman',
    level: 'Advanced',
    duration: '9h 10m',
    lessons: 61,
    rating: 4.9,
    studentsCount: 5032,
    progress: 42,
  },
};

export const AlmostDone = {
  args: {
    title: 'Advanced TypeScript Patterns',
    instructor: 'Priya Raman',
    level: 'Advanced',
    duration: '9h 10m',
    lessons: 61,
    rating: 4.9,
    studentsCount: 5032,
    progress: 92,
  },
};