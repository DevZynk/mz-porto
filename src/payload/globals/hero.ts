import {GlobalConfig } from 'payload'

export const Hero: GlobalConfig = {
  slug: 'hero',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'text', required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}
