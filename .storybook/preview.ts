import type { Preview } from '@storybook/react'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      values: [
        { name: 'dark', value: '#000' },
        { name: 'light', value: '#fff' },
      ],
    },
  },
}

export default preview
