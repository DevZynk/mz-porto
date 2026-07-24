import { GlobalConfig } from 'payload'

export const Meta: GlobalConfig = {
  slug: 'meta',
  admin: {
    group: 'Site Setting',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'siteSetting',
          label: 'Site Setting',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'siteDescription',
              type: 'text',
              required: true,
            },
            {
              name: 'address',
              type: 'group',
              required: true,
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'location',
                      label: 'Alamat Lengkap Kantor',
                      type: 'text',
                      maxLength: 100,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'maps',
                      label: 'Link Google Maps Embed/URL',
                      type: 'text',
                      maxLength: 1000,
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'business',
                  label: 'Detail Lokasi (Local SEO)',
                  type: 'group',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'city',
                          type: 'text',
                          label: 'Kota',
                          maxLength: 100,
                          admin: { width: '33%' },
                        },
                        {
                          name: 'region',
                          type: 'text',
                          label: 'Provinsi / Wilayah',
                          maxLength: 100,
                          admin: { width: '33%' },
                        },
                        {
                          name: 'postalCode',
                          type: 'text',
                          label: 'Kode Pos',
                          maxLength: 20,
                          admin: { width: '34%' },
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'latitude',
                          type: 'text',
                          label: 'Garis Lintang',
                          maxLength: 50,
                          admin: { width: '50%' },
                        },
                        {
                          name: 'longitude',
                          type: 'text',
                          label: 'Garis Bujur',
                          maxLength: 50,
                          admin: { width: '50%' },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'socialMedia',
          label: 'Social Media',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'email',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'phone',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'whatsapp',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'linkedin',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'instagram',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'facebook',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'tiktok',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'telegram',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              label: 'Pengaturan SEO',
              type: 'group',
              fields: [
                { name: 'metaTitle', type: 'text', label: 'Meta Title Default', maxLength: 200 },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  label: 'Meta Description Default',
                  maxLength: 500,
                },
                {
                  name: 'keywords',
                  type: 'text',
                  label: 'Keywords (pisahkan dengan koma)',
                  maxLength: 500,
                },
              ],
            },
            {
              name: 'openGraph',
              label: 'OpenGraph (Social Share)',
              type: 'group',
              fields: [
                { name: 'ogTitle', type: 'text', label: 'OG Title', maxLength: 200 },
                {
                  name: 'ogDescription',
                  type: 'textarea',
                  label: 'OG Description',
                  maxLength: 500,
                },
                { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'OG Banner Image' },
              ],
            },
            {
              name: 'advancedSEO',
              label: 'Advanced SEO',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'canonicalUrl',
                      type: 'text',
                      label: 'Canonical Base URL',
                      maxLength: 500,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'robots',
                      type: 'select',
                      label: 'Robots Directive',
                      options: [
                        { label: 'Index, Follow', value: 'index,follow' },
                        { label: 'No Index', value: 'noindex' },
                      ],
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
