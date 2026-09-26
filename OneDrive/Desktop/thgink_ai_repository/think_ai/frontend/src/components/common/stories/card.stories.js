import { fn } from "storybook/test";
import { Card } from "./Card";

const meta = {
  title: "Example/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    onAction: fn(),
  },
  argTypes: {
    eyebrow: { control: "text" },
    title: { control: "text" },
    meta: { control: "text" },
    actionLabel: { control: "text" },
    variant: {
      control: "select",
      options: ["teal", "amber", "danger"],
    },
  },
};

export default meta;

export const Default = {
  args: {
    eyebrow: "Live show",
    title: "Night Market Sessions",
    meta: "Sat 14 Nov · Doors 7:00 PM",
    variant: "teal",
    actionLabel: "Book ticket",
  },
};

export const AmberVariant = {
  args: {
    eyebrow: "Limited run",
    title: "Warehouse Screening",
    meta: "3 dates only",
    variant: "amber",
    actionLabel: "View details",
  },
};

export const SoldOut = {
  args: {
    eyebrow: "Live show",
    title: "Night Market Sessions",
    meta: "Sat 14 Nov · Doors 7:00 PM",
    variant: "danger",
    actionLabel: "Sold out",
  },
};