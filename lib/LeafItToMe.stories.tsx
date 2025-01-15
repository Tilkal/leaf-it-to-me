import type { Meta, StoryObj } from '@storybook/react'

import { LeafItToMe } from './LeafItToMe'
import config from './config.json'

const meta: Meta<typeof LeafItToMe> = {
  title: 'LeafItToMe',
  component: LeafItToMe,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof LeafItToMe>

export const Default: Story = {
  args: {
    tree: config,
  },
}
