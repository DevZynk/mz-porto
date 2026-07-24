import { randomUUID } from 'crypto'
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  labels: {
    singular: 'Media',
    plural: 'Media',
  },

  admin: {
    group: 'Media',
  },
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Deskripsi Gambar (Alt)',
      type: 'text',
      hooks: {
        beforeChange: [
          ({ value, req, data }) => {
            if (!value) {
              return (
                (req?.context?.originalFilename as string | undefined) ||
                data?.filename?.split('.')[0] ||
                'Media'
              )
            }
            return value
          },
        ],
      },
    },
  ],
  hooks: {
    beforeOperation: [
      ({ req, operation }) => {
        if ((operation === 'create' || operation === 'update') && req.file) {
          const originalName = req.file.name
          const ext = originalName.split('.').pop()
          if (!req.context) req.context = {}
          req.context.originalFilename = originalName.replace(/\.[^.]+$/, '')
          req.file.name = `${randomUUID()}.${ext}`
        }
      },
    ],
  },
  upload: {
    staticDir: 'media',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
}
