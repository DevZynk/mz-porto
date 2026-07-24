import { Block } from 'payload'

export const VideoEmbedBlock: Block = {
  slug: 'VideoEmbed',
  labels: {
    singular: 'Video Embed',
    plural: 'Video Embeds',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'Video URL (YouTube, Vimeo, dll.)',
      admin: {
        description: 'Masukkan URL video dari YouTube atau Vimeo. Contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    },
  ],
}
