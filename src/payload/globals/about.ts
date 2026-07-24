import { GlobalConfig } from 'payload'

export const About: GlobalConfig = {
  slug: 'about',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'item',
      type: 'array',
      maxRows: 2,
      minRows: 2,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: { width: '50%' },
              localized: true,
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: { width: '50%' },
              localized: true,
            },
          ],
        },
      ],
    },
    {
      name: 'content',
      type: 'array',
      minRows: 3,
      maxRows: 3,
      fields: [
        {
          name: 'paragraph',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}
