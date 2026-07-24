import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        hidden: true,
      },
      unique: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            const title = data?.meta?.metaTitle
            if (!title) return ''
            const cleanTitle = title
              .toString()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')
            return `${cleanTitle}-${Date.now()}`
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'meta',
          label: 'Meta',
          fields: [
            { name: 'metaTitle', label: 'Title', type: 'text', required: true },
            {
              name: 'metaDescription',
              label: 'Description',
              type: 'textarea',
              required: true,
            },
            {
              name: 'metaAuthor',
              label: 'Author',
              type: 'text',
              required: true,
            },
            {
              name: 'metaImage',
              label: 'Image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'category',
              label: 'Category',
              type: 'relationship',
              relationTo: 'category',
              required: true,
              hasMany: true,
            },
            {
              name: 'services',
              label: 'Relate Service',
              type: 'relationship',
              relationTo: 'services',
            },
            {
              name: 'client',
              label: 'client',
              type: 'relationship',
              relationTo: 'clients',
            },
            {
              name: 'likes',
              label: 'Likes',
              type: 'number',
              defaultValue: 0,
            },
            {
              name: 'comments',
              label: 'Comments',
              type: 'array',
              fields: [
                {
                  name: 'userName',
                  label: 'Name',
                  type: 'text',
                  required: true,
                  defaultValue: 'Anonim',
                },
                {
                  name: 'comment',
                  label: 'Comment',
                  type: 'textarea',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          name: 'content',
          label: 'Content',
          fields: [{ name: 'content', type: 'richText', required: true }],
        },
      ],
    },
  ],
}
