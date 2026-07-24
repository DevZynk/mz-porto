import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor, BlocksFeature, CodeBlock, UploadFeature } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'
import { imageOptimizer } from '@inoo-ch/payload-image-optimizer'
import { seoPlugin } from '@payloadcms/plugin-seo'


import { Users } from './payload/collections/Users'
import { Media } from './payload/collections/Media'
import { Meta } from './payload/globals/meta'
import { Services } from './payload/collections/Services'
import { News } from './payload/collections/news'
import { Category } from './payload/collections/category'
import { Hero } from './payload/globals/hero'
import { About } from './payload/globals/about'
import { Clients } from './payload/collections/Clients'
import { Projects } from './payload/collections/project'
import { VideoEmbedBlock } from './payload/blocks/VideoEmbed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Services, News, Category, Clients, Projects],
  globals:[Meta, Hero, About],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      UploadFeature({
        collections: {
          media: {
            fields: [
              {
                name: 'caption',
                type: 'text',
              },
            ],
          },
        },
      }),
      BlocksFeature({
        blocks: [
          CodeBlock(),
          VideoEmbedBlock,
        ],
      }),
    ],
  }),
  localization: {
    locales: [
      {
        label: 'Indonesia',
        code: 'id',
      },
      {
        label: 'English',
        code: 'en',
      },
    ],
    defaultLocale: 'id',
    fallback: true,
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
    plugins: [
    seoPlugin({
      collections: ['services'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `MZ Technology — ${doc.title || doc.meta?.metaTitle || ''}`,
      generateDescription: ({ doc }) => doc.description || doc.meta?.metaDescription || doc.smallDescription || '',
    }),
    imageOptimizer({
      collections: {
        media: true,
      },

      format: { format: 'webp', quality: 90 },
      maxDimensions: { width: 2560, height: 2560 },
      generateThumbHash: true,
      stripMetadata: true,
      clientOptimization: true,
      disabled: false,
      adminThumbnail: 'auto',
      metadataPolicy: ({ metadata }) => metadata.format === 'jpeg',
    }),
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || '',
          secretAccessKey: process.env.S3_SECRET_KEY || '',
        },
        region: process.env.S3_REGION || 'ap-southeast-1',
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
      },
    }),
  ],
})
