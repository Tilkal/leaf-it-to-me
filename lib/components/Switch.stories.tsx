import type { Meta, StoryObj } from '@storybook/react'

import { Switch } from './Switch'

import '../root.css'

const meta: Meta<typeof Switch> = {
  title: 'Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: {
    checked: true,
  },
  render: (props) => (
    <div style={{ width: '400px', height: '50px' }}>
      <Switch {...props} />
    </div>
  ),
}
