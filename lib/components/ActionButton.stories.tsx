import type { Meta, StoryObj } from '@storybook/react'

import { ActionButton } from './ActionButton'
import { Chevron } from './icons/Chevron'

import '../root.css'

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
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    icon: <Chevron />,
  },
}
