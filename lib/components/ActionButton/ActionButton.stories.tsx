import type { Meta, StoryObj } from '@storybook/react'

import { Chevron } from '../icons/Chevron'
import { ActionButton } from './index'

import '../../root.css'

const meta: Meta<typeof ActionButton> = {
  title: 'ActionButton',
  component: ActionButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ActionButton>

export const Default: Story = {
  args: {
    icon: <Chevron />,
    'aria-label': 'Default button',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    icon: <Chevron />,
    'aria-label': 'Disabled button',
  },
}

export const ButtonWithPopover: Story = {
  args: {
    icon: <Chevron />,
    'aria-label': 'Button with popover',
    popover: {
      content: 'Popover content',
    },
  },
}
