import type { Meta, StoryObj } from '@storybook/react'

import { NewUITest } from './NewUITest'

const meta: Meta<typeof NewUITest> = {
  title: 'NewUITest',
  component: NewUITest,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div
        style={{
          height: '100%',
          width: '700px',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof NewUITest>

export const Default: Story = {
  parameters: {
    backgrounds: {
      default: window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light',
    },
  },
}

export const Light: Story = {
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
  args: {
    theme: 'light',
  },
}

export const Dark: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  args: {
    theme: 'dark',
  },
}
