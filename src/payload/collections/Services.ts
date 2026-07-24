import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Main',
          fields: [
            {
              name: 'title',
              label: 'Title',
              type: 'text',
              required: true,
              localized: true,
            },
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
                    const title =
                      typeof data?.title === 'object' && data?.title
                        ? (Object.values(data.title)[0] as string) || ''
                        : (data?.title as string) || ''
                    if (!title) return ''
                    const cleanTitle = title
                      .toString()
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)/g, '')
                    return `${cleanTitle}`
                  },
                ],
              },
            },
            {
              name: 'smallDescription',
              label: 'Small Description',
              type: 'text',
              required: true,
              localized: true,
              maxLength: 200,
            },
            {
              name: 'image',
              label: 'Image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'features',
              type: 'array',
              maxRows: 6,
              minRows: 3,
              localized: true,
              fields: [
                {
                  name: 'feature',
                  type: 'text',
                },
              ],
            },
            {
              name: 'isFeatured',
              label: 'Featured Service (Layanan Unggulan)',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        {
          name: 'pricing',
          label: 'Pricing',
          fields: [
            {
              name: 'plans',
              label: 'Pricing Plans / Packages',
              type: 'array',
              localized: true,
              required: true,
              fields: [
                {
                  name: 'name',
                  label: 'Plan Name (e.g. Basic, Standard, Premium)',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'basePrice',
                  label: 'Base Price (Original price to be crossed out, optional)',
                  type: 'number',
                  required: true,
                },
                {
                  name: 'price',
                  label: 'Promo / Discount Price',
                  type: 'number',
                  required: true,
                },
                {
                  name: 'priceSuffix',
                  label: 'Price Suffix (e.g. / camera, / month, one-time)',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  label: 'Plan Description',
                  type: 'textarea',
                  required: true,
                },
                {
                  name: 'features',
                  label: 'Features Included in this Plan',
                  type: 'array',
                  required: true,
                  fields: [
                    {
                      name: 'feature',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'content',
          label: 'Content',
          fields: [
            {
              name: 'content',
              label: 'Content Description',
              type: 'richText',
            },
          ],
        },
      ],
    },
  ],
}
