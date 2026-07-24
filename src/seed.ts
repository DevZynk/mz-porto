import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'
import sharp from 'sharp'

async function createImage(
  alt: string,
  width: number,
  height: number,
  hex: string,
): Promise<Buffer> {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#${hex}"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
          fill="white" font-family="sans-serif" font-size="24" font-weight="bold">
      ${alt.replace(/&/g, '&amp;').replace(/</g, '&lt;')}
    </text>
  </svg>`
  return sharp(Buffer.from(svg)).webp({ quality: 80 }).toBuffer()
}

async function uploadMedia(
  payload: any,
  alt: string,
  w: number,
  h: number,
  hex: string,
): Promise<number> {
  const buf = await createImage(alt, w, h, hex)
  const media = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: buf,
      mimetype: 'image/webp',
      name: `${alt.replace(/\s+/g, '-').toLowerCase()}.webp`,
      size: buf.length,
    },
  })
  return media.id
}

function richText(paragraphs: { type?: 'h2' | 'h3' | 'p'; text: string }[]): any {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: paragraphs.map((p) => {
        if (p.type === 'h2') {
          return {
            tag: 'h2',
            type: 'heading',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                mode: 'normal',
                text: p.text,
                type: 'text',
                style: '',
                detail: 0,
                format: 1,
                version: 1,
              },
            ],
            direction: null,
          }
        }
        if (p.type === 'h3') {
          return {
            tag: 'h3',
            type: 'heading',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                mode: 'normal',
                text: p.text,
                type: 'text',
                style: '',
                detail: 0,
                format: 1,
                version: 1,
              },
            ],
            direction: null,
          }
        }
        return {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              mode: 'normal',
              text: p.text,
              type: 'text',
              style: '',
              detail: 0,
              format: 0,
              version: 1,
            },
          ],
          direction: null,
          textStyle: '',
          textFormat: 0,
        }
      }),
      direction: null,
    },
  }
}

function localized(en: string, _id: string) {
  return en
}

async function main() {
  const payload = await getPayload({ config })

  // ─── GENERATE IMAGES ────────────────────────────────────────────
  console.log('Generating images...')

  const heroImg = await uploadMedia(payload, 'Hero Background', 1920, 800, '1a1a2e')
  const s1Img = await uploadMedia(payload, 'IT Infrastructure', 800, 600, '1a1a2e')
  const s2Img = await uploadMedia(payload, 'Hardware Solutions', 800, 600, '16213e')
  const s3Img = await uploadMedia(payload, 'Security Systems', 800, 600, '0f3460')
  const s4Img = await uploadMedia(payload, 'Server Data Center', 800, 600, '533483')
  const s5Img = await uploadMedia(payload, 'IT Consulting', 800, 600, '3b82f6')
  const s6Img = await uploadMedia(payload, 'Network Design', 800, 600, '06b6d4')
  const newsImg = await uploadMedia(payload, 'Tech News', 1280, 720, '1e293b')
  const projectImg = await uploadMedia(payload, 'Project', 800, 600, '0f172a')

  const clientLogos = [
    await uploadMedia(payload, 'Bank Kalsel', 200, 100, '1e3a5f'),
    await uploadMedia(payload, 'PDAM Bandarmasih', 200, 100, '2d6a4f'),
    await uploadMedia(payload, 'PT Pelindo', 200, 100, '0b525b'),
    await uploadMedia(payload, 'ULM', 200, 100, '5c4d7d'),
    await uploadMedia(payload, 'BKD Kalsel', 200, 100, '7f5539'),
    await uploadMedia(payload, 'PT Antam', 200, 100, '2b2d42'),
    await uploadMedia(payload, 'PLN', 200, 100, '1a5b8c'),
    await uploadMedia(payload, 'Polda Kalsel', 200, 100, '3d0c11'),
    await uploadMedia(payload, 'BPSDMD', 200, 100, '5c4d7d'),
    await uploadMedia(payload, 'Dishub Kalsel', 200, 100, '1b4965'),
    await uploadMedia(payload, 'RSUD Ulin', 200, 100, '8d0801'),
    await uploadMedia(payload, 'PT Citra Buana', 200, 100, '2b2d42'),
  ]

  // ─── CATEGORIES ──────────────────────────────────────────────────
  console.log('Seeding categories...')
  const catData = [
    { title: 'Docker', slug: 'docker' },
    { title: 'Next JS', slug: 'next_js' },
    { title: 'SEO', slug: 'seo' },
    { title: 'React', slug: 'react' },
    { title: 'Payload CMS', slug: 'payload_cms' },
    { title: 'News', slug: 'news' },
    { title: 'Learn', slug: 'learn' },
    { title: 'Project', slug: 'project' },
    { title: 'Networking', slug: 'networking' },
    { title: 'Security', slug: 'security' },
  ]
  const cats: Record<string, number> = {}
  for (const c of catData) {
    const exists = await payload.find({
      collection: 'category',
      where: { slug: { equals: c.slug } },
    })
    if (exists.docs.length > 0) {
      cats[c.slug] = exists.docs[0].id
    } else {
      const created = await payload.create({ collection: 'category', data: c })
      cats[c.slug] = created.id
    }
  }

  // ─── CLIENTS ─────────────────────────────────────────────────────
  console.log('Seeding clients...')
  const clientNames = [
    'Bank Kalsel',
    'PDAM Bandarmasih',
    'PT. Pelindo',
    'Universitas Lambung Mangkurat',
    'BKD Kalsel',
    'PT. Antam',
    'PLN',
    'Polda Kalsel',
    'BPSDMD Kalsel',
    'Dishub Kalsel',
    'RSUD Ulin',
    'PT. Citra Buana',
  ]
  const clientIds: Record<string, number> = {}
  for (let i = 0; i < clientNames.length; i++) {
    const name = clientNames[i]
    const exists = await payload.find({ collection: 'clients', where: { name: { equals: name } } })
    if (exists.docs.length > 0) {
      clientIds[name] = exists.docs[0].id
    } else {
      const created = await payload.create({
        collection: 'clients',
        data: { name, logo: clientLogos[i] },
      })
      clientIds[name] = created.id
    }
  }

  // ─── SERVICES ────────────────────────────────────────────────────
  console.log('Seeding services...')

  const pricingPlans = (name: string) => [
    {
      name: 'Basic',
      basePrice: 500000,
      price: 350000,
      priceSuffix: '/project',
      description: `Essential ${name.toLowerCase()} for small businesses.`,
      features: [
        { feature: 'Basic Setup' },
        { feature: 'Standard Support' },
        { feature: '1 Month Warranty' },
      ],
    },
    {
      name: 'Standard',
      basePrice: 1500000,
      price: 1000000,
      priceSuffix: '/project',
      description: `Comprehensive ${name.toLowerCase()} for growing businesses.`,
      features: [
        { feature: 'Full Setup & Configuration' },
        { feature: 'Priority Support' },
        { feature: '3 Month Warranty' },
        { feature: 'Maintenance Included' },
      ],
    },
    {
      name: 'Premium',
      basePrice: 5000000,
      price: 3500000,
      priceSuffix: '/project',
      description: `Enterprise-grade ${name.toLowerCase()} with full coverage.`,
      features: [
        { feature: 'Complete End-to-End Solution' },
        { feature: '24/7 Dedicated Support' },
        { feature: '12 Month Warranty' },
        { feature: 'Regular Maintenance' },
        { feature: 'Priority Response' },
      ],
    },
  ]

  const services = [
    {
      slug: 'it-infrastructure',
      title: localized(
        'IT Infrastructure & Network Solutions',
        'Solusi Infrastruktur IT & Jaringan',
      ),
      smallDescription: localized(
        'We design, install, and maintain reliable network infrastructures to support stable and secure business operations.',
        'Kami merancang, memasang, dan memelihara infrastruktur jaringan yang handal untuk mendukung operasi bisnis yang stabil dan aman.',
      ),
      image: s1Img,
      features: [
        { feature: localized('LAN/WAN Setup', 'Setup LAN/WAN') },
        { feature: localized('MikroTik Configuration', 'Konfigurasi MikroTik') },
        { feature: localized('Wireless Systems', 'Sistem Wireless') },
        { feature: localized('Network Optimization', 'Optimasi Jaringan') },
        { feature: localized('Network Security', 'Keamanan Jaringan') },
      ],
      isFeatured: true,
      pricing: { plans: pricingPlans('IT Infrastructure') },
      content: {
        content: richText([
          {
            type: 'p',
            text: 'We design, install, and maintain reliable network infrastructures to support stable and secure business operations. Includes LAN/WAN setup, MikroTik configuration, wireless systems, and network optimization to ensure maximum performance and uptime.',
          },
          { type: 'h2', text: 'Our Network Solutions' },
          {
            type: 'p',
            text: 'From small office networks to enterprise-grade infrastructure, MZ Technology delivers end-to-end networking solutions that scale with your business.',
          },
          { type: 'h3', text: 'Why Choose Our Network Services?' },
          {
            type: 'p',
            text: 'Our certified engineers have years of experience designing and implementing networks for businesses across Kalimantan Selatan. We use industry-leading equipment and follow best practices to ensure reliability, security, and performance.',
          },
        ]),
      },
    },
    {
      slug: 'hardware-software',
      title: localized('Hardware & Software Solutions', 'Solusi Perangkat Keras & Lunak'),
      smallDescription: localized(
        'End-to-end IT support covering installation, troubleshooting, maintenance, and upgrades for hardware and software systems.',
        'Dukungan IT menyeluruh meliputi instalasi, pemecahan masalah, perawatan, dan upgrade untuk sistem perangkat keras dan lunak.',
      ),
      image: s2Img,
      features: [
        { feature: localized('PC & Laptop Support', 'Dukungan PC & Laptop') },
        { feature: localized('Printer & Peripherals', 'Printer & Periferal') },
        { feature: localized('Software Installation', 'Instalasi Software') },
        { feature: localized('System Maintenance', 'Perawatan Sistem') },
        { feature: localized('Hardware Troubleshooting', 'Pemecahan Masalah Hardware') },
      ],
      isFeatured: true,
      pricing: {
        plans: pricingPlans('Hardware & Software'),
      },
      content: {
        content: richText([
          {
            type: 'p',
            text: 'We provide end-to-end IT support covering installation, troubleshooting, maintenance, and upgrades for hardware and software systems. From PCs, laptops, printers, to business applications, we ensure all systems run efficiently and reliably.',
          },
          { type: 'h2', text: 'Comprehensive IT Support' },
          {
            type: 'p',
            text: 'Our team handles everything from hardware procurement and assembly to software installation and system configuration, ensuring your technology works seamlessly.',
          },
          { type: 'h3', text: 'Business Benefits' },
          {
            type: 'p',
            text: 'Reduce downtime, improve productivity, and extend the lifespan of your IT assets with our professional hardware and software support services.',
          },
        ]),
      },
    },
    {
      slug: 'security-systems',
      title: localized(
        'Security Systems (CCTV & Access Control)',
        'Sistem Keamanan (CCTV & Access Control)',
      ),
      smallDescription: localized(
        'Professional installation and integration of CCTV, access control systems, and security solutions tailored to your needs.',
        'Instalasi profesional dan integrasi CCTV, sistem kontrol akses, dan solusi keamanan yang disesuaikan dengan kebutuhan Anda.',
      ),
      image: s3Img,
      features: [
        { feature: localized('CCTV Installation', 'Instalasi CCTV') },
        { feature: localized('Access Control Systems', 'Sistem Kontrol Akses') },
        { feature: localized('Security Integration', 'Integrasi Keamanan') },
        { feature: localized('Remote Monitoring', 'Pemantauan Jarak Jauh') },
        { feature: localized('Alarm Systems', 'Sistem Alarm') },
      ],
      isFeatured: true,
      pricing: { plans: pricingPlans('Security Systems') },
      content: {
        content: richText([
          {
            type: 'p',
            text: 'We deliver professional installation and integration of CCTV, access control systems, and various security solutions. Each solution is tailored to client needs with a focus on security, scalability, and long-term system reliability.',
          },
          { type: 'h2', text: 'Security Solutions' },
          {
            type: 'p',
            text: 'Protect your business with our comprehensive security systems, from HD CCTV cameras to biometric access control and integrated alarm systems.',
          },
          { type: 'h3', text: 'Why Security Matters' },
          {
            type: 'p',
            text: 'With increasing security challenges, businesses need reliable surveillance and access control systems. Our solutions provide peace of mind with 24/7 monitoring capabilities and professional installation.',
          },
        ]),
      },
    },
    {
      slug: 'server-data-center',
      title: localized('Server & Data Center Solutions', 'Solusi Server & Data Center'),
      smallDescription: localized(
        'Server deployment, configuration, and maintenance for business continuity and optimal performance.',
        'Penyebaran, konfigurasi, dan perawatan server untuk kelangsungan bisnis dan kinerja optimal.',
      ),
      image: s4Img,
      features: [
        { feature: localized('Server Deployment', 'Penyebaran Server') },
        { feature: localized('Data Center Setup', 'Setup Data Center') },
        { feature: localized('Storage Solutions', 'Solusi Penyimpanan') },
        { feature: localized('Backup & Recovery', 'Cadangan & Pemulihan') },
        { feature: localized('Virtualization', 'Virtualisasi') },
      ],
      isFeatured: false,
      pricing: {
        plans: pricingPlans('Server & Data Center'),
      },
      content: {
        content: richText([
          {
            type: 'p',
            text: 'Server deployment, configuration, and maintenance for business continuity and optimal performance. We handle everything from physical server installation to virtualized environments.',
          },
          { type: 'h2', text: 'Server Solutions' },
          {
            type: 'p',
            text: 'Whether you need on-premise servers, hybrid solutions, or full data center setup, our team has the expertise to design and implement the right infrastructure.',
          },
          { type: 'h3', text: 'Data Protection' },
          {
            type: 'p',
            text: 'Implement robust backup and disaster recovery solutions to protect your critical business data. Our solutions ensure business continuity even in worst-case scenarios.',
          },
        ]),
      },
    },
    {
      slug: 'it-consulting',
      title: localized('IT Consulting & Technical Support', 'Konsultasi IT & Dukungan Teknis'),
      smallDescription: localized(
        'Professional IT consulting and technical support to help your business leverage technology effectively.',
        'Konsultasi IT profesional dan dukungan teknis untuk membantu bisnis Anda memanfaatkan teknologi secara efektif.',
      ),
      image: s5Img,
      features: [
        { feature: localized('IT Assessment', 'Penilaian IT') },
        { feature: localized('Technical Support', 'Dukungan Teknis') },
        { feature: localized('System Audit', 'Audit Sistem') },
        { feature: localized('IT Planning', 'Perencanaan IT') },
        { feature: localized('Help Desk Services', 'Layanan Help Desk') },
      ],
      isFeatured: false,
      pricing: { plans: pricingPlans('IT Consulting') },
      content: {
        content: richText([
          {
            type: 'p',
            text: 'Professional IT consulting and technical support to help your business leverage technology effectively. Our consultants work closely with your team to identify opportunities and implement solutions.',
          },
          { type: 'h2', text: 'Consulting Services' },
          {
            type: 'p',
            text: 'Get expert advice on technology strategy, infrastructure planning, and digital transformation initiatives tailored to your business goals.',
          },
          { type: 'h3', text: 'Ongoing Support' },
          {
            type: 'p',
            text: 'Our help desk and technical support services ensure your business runs smoothly with minimal IT disruptions. We provide responsive support when you need it most.',
          },
        ]),
      },
    },
    {
      slug: 'network-design',
      title: localized('Network Design & Optimization', 'Desain & Optimalisasi Jaringan'),
      smallDescription: localized(
        'Custom network design and optimization services for maximum performance and reliability.',
        'Layanan desain dan optimalisasi jaringan khusus untuk kinerja dan keandalan maksimal.',
      ),
      image: s6Img,
      features: [
        { feature: localized('Network Design', 'Desain Jaringan') },
        { feature: localized('Performance Optimization', 'Optimasi Kinerja') },
        { feature: localized('Load Balancing', 'Penyeimbangan Beban') },
        { feature: localized('Bandwidth Management', 'Manajemen Bandwidth') },
        { feature: localized('Network Monitoring', 'Pemantauan Jaringan') },
      ],
      isFeatured: false,
      pricing: { plans: pricingPlans('Network Design') },
      content: {
        content: richText([
          {
            type: 'p',
            text: 'Custom network design and optimization services for maximum performance and reliability. Our team analyzes your current infrastructure and designs solutions that meet your specific needs.',
          },
          { type: 'h2', text: 'Network Optimization' },
          {
            type: 'p',
            text: 'Improve your network performance with load balancing, bandwidth management, and optimization techniques that ensure smooth operations.',
          },
          { type: 'h3', text: 'Monitoring & Management' },
          {
            type: 'p',
            text: 'We provide ongoing network monitoring and management services to identify and resolve issues before they impact your business.',
          },
        ]),
      },
    },
  ]

  for (const svc of services) {
    const exists = await payload.find({
      collection: 'services',
      where: { slug: { equals: svc.slug } },
    })
    if (exists.docs.length > 0) {
      await payload.update({ collection: 'services', id: exists.docs[0].id, data: svc as any })
      console.log(`  Updated service: ${svc.slug}`)
    } else {
      await payload.create({ collection: 'services', data: svc as any })
      console.log(`  Created service: ${svc.slug}`)
    }
  }

  // ─── GLOBALS ─────────────────────────────────────────────────────
  console.log('Seeding globals...')

  try {
    await payload.updateGlobal({
      slug: 'hero',
      data: {
        title: 'Reliable IT Solutions For Your Business',
        description:
          'MZ Technology is an IT solutions provider focused on delivering reliable, efficient, and professional technology services for businesses and organizations. We provide end-to-end IT support covering hardware, software, networking, security systems, and various IT projects.',
        image: heroImg,
      },
    })
    console.log('  Hero global set')
  } catch {
    console.log('  Hero global skipped')
  }

  try {
    await payload.updateGlobal({
      slug: 'about',
      data: {
        title: localized(
          'Building Trust, Delivering Technology Excellence Since 2011',
          'Membangun Kepercayaan, Menghadirkan Keunggulan Teknologi Sejak 2011',
        ),
        description: localized(
          'MZ Technology is a trusted IT solutions provider committed to delivering reliable, innovative, and professional technology services.',
          'MZ Technology adalah penyedia solusi IT terpercaya yang berkomitmen memberikan layanan teknologi yang handal, inovatif, dan profesional.',
        ),
        item: [
          {
            title: localized('Years Experience', 'Pengalaman'),
            value: localized('Since 2011', 'Sejak 2011'),
          },
          {
            title: localized('Projects Completed', 'Proyek Selesai'),
            value: localized('100+', '100+'),
          },
        ],
        content: [
          {
            paragraph: localized(
              'Established in 2011, MZ Technology is a trusted IT solutions provider committed to delivering reliable, innovative, and professional technology services. We specialize in network infrastructure, hardware and software solutions, security systems, server deployment, and end-to-end IT project implementation.',
              'Berdiri sejak 2011, MZ Technology adalah penyedia solusi IT terpercaya yang berkomitmen memberikan layanan teknologi yang handal, inovatif, dan profesional. Kami berspesialisasi dalam infrastruktur jaringan, solusi perangkat keras dan lunak, sistem keamanan, penyebaran server, dan implementasi proyek IT menyeluruh.',
            ),
          },
          {
            paragraph: localized(
              'With years of experience across various industries, we understand that every business has unique challenges and requirements. That is why we focus on providing customized solutions that enhance productivity, improve efficiency, and support long-term business growth.',
              'Dengan pengalaman bertahun-tahun di berbagai industri, kami memahami bahwa setiap bisnis memiliki tantangan dan kebutuhan unik. Oleh karena itu kami fokus menyediakan solusi khusus yang meningkatkan produktivitas, efisiensi, dan mendukung pertumbuhan bisnis jangka panjang.',
            ),
          },
          {
            paragraph: localized(
              'Driven by technical expertise and a commitment to customer satisfaction, MZ Technology continues to be a trusted partner for businesses seeking secure, scalable, and future-ready technology solutions.',
              'Didorong oleh keahlian teknis dan komitmen terhadap kepuasan pelanggan, MZ Technology terus menjadi mitra terpercaya bagi bisnis yang mencari solusi teknologi yang aman, skalabel, dan siap masa depan.',
            ),
          },
        ],
      },
    })
    console.log('  About global set')
  } catch {
    console.log('  About global skipped')
  }

  try {
    await payload.updateGlobal({
      slug: 'meta',
      data: {
        siteSetting: {
          siteName: 'MZ Technology',
          logo: clientLogos[0],
          siteDescription:
            'Reliable IT Solutions For Your Business | Solusi IT Terpercaya untuk Bisnis Anda',
          address: {
            location: 'Banjarmasin, Kalimantan Selatan, Indonesia',
            maps: 'https://maps.app.goo.gl/2QtXiesfgm4BfYRs8',
            business: {
              city: 'Banjarmasin',
              region: 'Kalimantan Selatan',
              postalCode: '70114',
              latitude: '-3.3186',
              longitude: '114.5944',
            },
          },
        },
        socialMedia: {
          email: 'mz.techbjm@gmail.com',
          phone: '+6281521907477',
          whatsapp: '+6281521907477',
          linkedin: 'https://linkedin.com/company/mz-technology',
          instagram: 'https://www.instagram.com/mz.tech_',
          facebook: 'https://facebook.com/mztechnology',
          tiktok: 'https://tiktok.com/@mz.tech',
          telegram: 'https://t.me/mztechnology',
        },
        seo: {
          metaTitle: 'MZ Technology — Reliable IT Solutions For Your Business',
          metaDescription:
            'MZ Technology adalah penyedia solusi IT profesional di Banjarmasin. Layanan: Infrastruktur Jaringan, CCTV, Server, Konsultasi IT, dan lainnya.',
          keywords:
            'IT solutions, jaringan, CCTV, server, IT support, Banjarmasin, Kalimantan Selatan, MZ Technology, network infrastructure, security systems',
        },
        openGraph: {
          ogTitle: 'MZ Technology — Reliable IT Solutions For Your Business',
          ogDescription:
            'Penyedia solusi IT terpercaya sejak 2011. Spesialis infrastruktur jaringan, sistem keamanan, server, dan konsultasi IT.',
          ogImage: heroImg,
        },
        advancedSEO: {
          canonicalUrl: 'https://mz-technology.odoo.com',
          robots: 'index,follow',
        },
      },
    })
    console.log('  Meta global set')
  } catch {
    console.log('  Meta global skipped')
  }

  // ─── CLEANUP PREVIOUS SEED ──────────────────────────────────────
  const prevNews = await payload.find({
    collection: 'news',
    where: { 'meta.metaAuthor': { equals: 'MZ Technology' } },
    limit: 100,
  })
  for (const n of prevNews.docs) {
    await payload.delete({ collection: 'news', id: n.id })
  }
  const prevProjects = await payload.find({
    collection: 'projects',
    where: { 'meta.metaAuthor': { equals: 'MZ Technology' } },
    limit: 100,
  })
  for (const p of prevProjects.docs) {
    await payload.delete({ collection: 'projects', id: p.id })
  }

  // ─── NEWS ────────────────────────────────────────────────────────
  console.log('Seeding news...')

  const newsArticles = [
    {
      title: 'Cloud and AI Services Continue to Expand Across Enterprises',
      description:
        'Organizations are increasing investments in cloud computing and AI platforms to improve operational efficiency and reduce infrastructure costs.',
      category: ['news', 'networking'],
      paragraphs: [
        {
          type: 'p' as const,
          text: 'Enterprises worldwide are accelerating their adoption of cloud-based AI services. According to recent industry reports, spending on cloud AI infrastructure has grown significantly as businesses seek to leverage machine learning and advanced analytics capabilities.',
        },
        {
          type: 'p' as const,
          text: 'Major cloud providers including AWS, Microsoft Azure, and Google Cloud are continuously expanding their AI service offerings, making it easier for organizations of all sizes to integrate intelligent capabilities into their operations.',
        },
        { type: 'h2' as const, text: 'Key Benefits' },
        {
          type: 'p' as const,
          text: 'The integration of AI with cloud computing offers several advantages: reduced operational costs through automation, improved decision-making with data-driven insights, enhanced customer experiences through personalization, and faster time-to-market for new products and services.',
        },
        {
          type: 'p' as const,
          text: 'As these technologies continue to mature, we can expect even greater adoption across industries throughout 2026 and beyond.',
        },
      ],
    },
    {
      title: 'Wi-Fi 7 Adoption Expected to Surge Across Enterprise Networks',
      description:
        'Industry analysts predict 2026 will become a turning point for Wi-Fi 7 deployment with increasing device compatibility and growing bandwidth demands.',
      category: ['news', 'networking'],
      paragraphs: [
        { type: 'h2' as const, text: 'The Next Generation of Wireless' },
        {
          type: 'p' as const,
          text: 'Wi-Fi 7, also known as IEEE 802.11be, promises to deliver unprecedented speeds and reliability for enterprise networks. With theoretical speeds of up to 46 Gbps, Wi-Fi 7 is designed to handle the most demanding applications.',
        },
        {
          type: 'p' as const,
          text: 'As more devices become Wi-Fi 7 compatible and the cost of access points decreases, businesses are finding it increasingly feasible to upgrade their networks.',
        },
        { type: 'h3' as const, text: 'Why Enterprises Are Upgrading' },
        {
          type: 'p' as const,
          text: 'The surge in bandwidth-intensive applications such as 4K/8K video conferencing, VR/AR training, IoT deployments, and cloud-based collaboration tools is driving the need for faster and more reliable wireless connectivity.',
        },
        {
          type: 'p' as const,
          text: 'Wi-Fi 7 addresses these needs with features like multi-link operation, 320 MHz channels, and enhanced MU-MIMO technology.',
        },
      ],
    },
    {
      title: 'Microsoft Delivers Major Security Improvements for Windows 11',
      description:
        'Microsoft latest Windows update addresses hundreds of vulnerabilities and introduces several performance enhancements including stronger BitLocker protection.',
      category: ['news', 'security'],
      paragraphs: [
        { type: 'h2' as const, text: 'Security at the Core' },
        {
          type: 'p' as const,
          text: 'Microsoft has released a significant update for Windows 11 that addresses over 200 security vulnerabilities, including several zero-day exploits.',
        },
        { type: 'h3' as const, text: 'Key Improvements' },
        {
          type: 'p' as const,
          text: 'The update includes enhanced BitLocker encryption performance, improved Windows Hello biometric authentication, stronger protection against firmware attacks, and better integration with Microsoft Defender for Endpoint.',
        },
        {
          type: 'p' as const,
          text: 'IT administrators are encouraged to deploy this update as soon as possible to ensure their systems are protected against the latest threats.',
        },
      ],
    },
    {
      title: 'AI Security Becomes a Top Priority for Technology Companies',
      description:
        'Governments and major technology companies are placing greater emphasis on AI safety and cybersecurity with new policies and security frameworks.',
      category: ['news', 'security'],
      paragraphs: [
        { type: 'h2' as const, text: 'The AI Security Imperative' },
        {
          type: 'p' as const,
          text: 'With the rapid advancement of AI technologies, security has become a paramount concern for technology companies worldwide.',
        },
        {
          type: 'p' as const,
          text: 'Leading technology firms are investing heavily in AI security research, developing new frameworks for responsible AI deployment, and collaborating with government agencies to establish security standards.',
        },
        { type: 'h3' as const, text: 'What This Means for Businesses' },
        {
          type: 'p' as const,
          text: 'Organizations adopting AI solutions must prioritize security from the outset, including robust data governance, model transparency, and regular security audits.',
        },
      ],
    },
    {
      title: 'Growing AI Demand Continues to Drive Data Center Expansion',
      description:
        'The increasing use of AI technologies is fueling rapid growth in data center infrastructure worldwide with high-performance servers and advanced networking.',
      category: ['news'],
      paragraphs: [
        { type: 'h2' as const, text: 'Data Center Boom' },
        {
          type: 'p' as const,
          text: 'The demand for AI computing power is driving unprecedented growth in data center construction and expansion worldwide.',
        },
        {
          type: 'p' as const,
          text: 'Hyperscale cloud providers and enterprises alike are investing billions in new facilities equipped with high-performance GPUs and specialized AI hardware.',
        },
        { type: 'h3' as const, text: 'Local Impact' },
        {
          type: 'p' as const,
          text: 'In Indonesia, the data center market is experiencing similar growth, driving demand for skilled IT professionals and reliable infrastructure partners like MZ Technology.',
        },
      ],
    },
    {
      title: 'Quantum Computing Advances Continue to Accelerate Worldwide',
      description:
        'Recent breakthroughs in quantum chips and neutral atom architecture bring us closer to commercially viable quantum computers.',
      category: ['news'],
      paragraphs: [
        { type: 'h2' as const, text: 'The Quantum Revolution' },
        {
          type: 'p' as const,
          text: 'Quantum computing is moving from theoretical research to practical application at an accelerating pace.',
        },
        {
          type: 'p' as const,
          text: 'Major technology companies including IBM, Google, and Microsoft are reporting significant progress in their quantum computing programs.',
        },
        { type: 'h3' as const, text: 'What This Means' },
        {
          type: 'p' as const,
          text: 'Businesses should begin preparing for quantum computing impact on cryptography, drug discovery, financial modeling, and optimization problems.',
        },
      ],
    },
    {
      title: 'The Rise of Edge Computing in 2026',
      description:
        'Edge computing transforms data processing by bringing computation closer to the data source for lower latency and improved real-time decision-making.',
      category: ['news', 'networking'],
      paragraphs: [
        { type: 'h2' as const, text: 'Computing at the Edge' },
        {
          type: 'p' as const,
          text: 'Edge computing has emerged as one of the most significant technology trends of 2026, enabling faster response times and reduced network congestion.',
        },
        {
          type: 'p' as const,
          text: 'By processing data closer to where it is generated, organizations can achieve lower latency and improved data sovereignty compliance.',
        },
        { type: 'h3' as const, text: 'Use Cases' },
        {
          type: 'p' as const,
          text: 'Key applications include industrial automation, autonomous vehicles, smart cities, retail analytics, and healthcare monitoring.',
        },
      ],
    },
    {
      title: 'Android 17 Introduces New Features for Productivity and Content Creation',
      description:
        'Google latest Android version brings improved screen recording tools, enhanced personalization, security improvements, and new productivity features.',
      category: ['news'],
      paragraphs: [
        { type: 'h2' as const, text: 'Android 17 Overview' },
        {
          type: 'p' as const,
          text: 'Google latest Android version brings a host of new features focused on productivity, content creation, and security.',
        },
        { type: 'h3' as const, text: 'New Capabilities' },
        {
          type: 'p' as const,
          text: 'Android 17 introduces advanced screen recording with editing capabilities, improved multitasking, AI-powered photo editing tools, and stronger privacy controls.',
        },
        {
          type: 'p' as const,
          text: 'For businesses, Android 17 includes better MDM integration, enhanced work profile capabilities, and improved security compliance tools.',
        },
      ],
    },
  ]

  for (const article of newsArticles) {
    const ts = Date.now() + Math.floor(Math.random() * 1000)
    const slug =
      article.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      ts
    const categoryIds = article.category.map((c) => cats[c]).filter(Boolean)

    await payload.create({
      collection: 'news',
      data: {
        slug,
        meta: {
          metaTitle: article.title,
          metaDescription: article.description,
          metaAuthor: 'MZ Technology',
          metaImage: newsImg,
          category: categoryIds,
          likes: Math.floor(Math.random() * 30) + 5,
          comments: [
            {
              userName: 'Anonim',
              comment: 'Artikel yang sangat informatif, terima kasih MZ Technology!',
            },
            { userName: 'Budi', comment: 'Semoga makin maju terus MZ Technology' },
          ],
        },
        content: { content: richText(article.paragraphs) },
      },
    })
    console.log(`  Created news: ${article.title.slice(0, 50)}...`)
  }

  // ─── PROJECTS ────────────────────────────────────────────────────
  console.log('Seeding projects...')

  const projects = [
    {
      title: 'Instalasi Jaringan Fiber Optik — PDAM Bandarmasih',
      description:
        'Instalasi jaringan fiber optik untuk mendukung sistem informasi dan operasional PDAM Bandarmasih di seluruh kantor cabang.',
      client: 'PDAM Bandarmasih',
      cat: ['networking', 'project'],
      svc: 'it-infrastructure',
    },
    {
      title: 'Pengadaan Server & Storage — Bank Kalsel',
      description:
        'Pengadaan dan konfigurasi server serta storage untuk sistem perbankan Bank Kalsel dengan keamanan dan redundansi tinggi.',
      client: 'Bank Kalsel',
      cat: ['project'],
      svc: 'server-data-center',
    },
    {
      title: 'Sistem CCTV 50 Titik — Polda Kalsel',
      description:
        'Instalasi sistem CCTV berbasis IP untuk 50 titik pemantauan di lingkungan Polda Kalimantan Selatan.',
      client: 'Polda Kalsel',
      cat: ['security', 'project'],
      svc: 'security-systems',
    },
    {
      title: 'Migrasi Data Center — PT. Pelindo',
      description:
        'Migrasi total infrastruktur data center PT. Pelindo ke sistem baru dengan downtime minimal dan keamanan data terjamin.',
      client: 'PT. Pelindo',
      cat: ['project'],
      svc: 'server-data-center',
    },
    {
      title: 'Access Control System — RSUD Ulin',
      description:
        'Pemasangan sistem kontrol akses berbasis kartu dan biometrik untuk 20 pintu di RSUD Ulin Banjarmasin.',
      client: 'RSUD Ulin',
      cat: ['security', 'project'],
      svc: 'security-systems',
    },
    {
      title: 'Wireless Network Kampus — Universitas Lambung Mangkurat',
      description:
        'Perancangan dan implementasi jaringan wireless untuk seluruh area kampus Universitas Lambung Mangkurat.',
      client: 'Universitas Lambung Mangkurat',
      cat: ['networking', 'project'],
      svc: 'network-design',
    },
    {
      title: 'MikroTik Failover & Load Balancing — BKD Kalsel',
      description:
        'Konfigurasi MikroTik untuk failover otomatis dan load balancing PCC di lingkungan BKD Kalimantan Selatan.',
      client: 'BKD Kalsel',
      cat: ['networking', 'project'],
      svc: 'it-infrastructure',
    },
    {
      title: 'Backup & Disaster Recovery — PT. Antam',
      description:
        'Implementasi sistem backup dan disaster recovery untuk data kritikal PT. Antam menggunakan NAS dan cloud hybrid.',
      client: 'PT. Antam',
      cat: ['project'],
      svc: 'server-data-center',
    },
    {
      title: 'Pengadaan 200 Workstation — Dishub Kalsel',
      description:
        'Pengadaan, instalasi, dan konfigurasi 200 unit workstation beserta software pendukung untuk Dinas Perhubungan Kalsel.',
      client: 'Dishub Kalsel',
      cat: ['project'],
      svc: 'hardware-software',
    },
    {
      title: 'Network Infrastructure Overhaul — PT. Citra Buana',
      description:
        'Perombakan total infrastruktur jaringan PT. Citra Buana termasuk routing, switching, dan sistem keamanan jaringan.',
      client: 'PT. Citra Buana',
      cat: ['networking', 'security', 'project'],
      svc: 'it-infrastructure',
    },
  ]

  const svcDocs = await payload.find({ collection: 'services', limit: 100 })
  const svcMap: Record<string, number> = {}
  for (const s of svcDocs.docs) {
    svcMap[s.slug] = s.id
  }

  for (const proj of projects) {
    const ts = Date.now() + Math.floor(Math.random() * 1000)
    const slug =
      proj.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      ts
    const categoryIds = proj.cat.map((c) => cats[c]).filter(Boolean)
    const clientId = clientIds[proj.client]
    const serviceId = svcMap[proj.svc]

    await payload.create({
      collection: 'projects',
      data: {
        slug,
        meta: {
          metaTitle: proj.title,
          metaDescription: proj.description,
          metaAuthor: 'MZ Technology',
          metaImage: projectImg,
          category: categoryIds,
          services: serviceId,
          client: clientId,
          likes: Math.floor(Math.random() * 50) + 10,
          comments: [
            {
              userName: 'Client',
              comment: 'Terima kasih MZ Technology, proyek selesai dengan baik dan tepat waktu!',
            },
            { userName: 'Anonim', comment: 'Profesional dan berkualitas, recommended!' },
            { userName: 'Manager', comment: 'Sangat puas dengan hasil kerja tim MZ Technology' },
          ],
        },
        content: {
          content: richText([
            { type: 'p', text: proj.description },
            { type: 'h2', text: 'Project Overview' },
            {
              type: 'p',
              text: `This project was completed by MZ Technology for ${proj.client}. Our team delivered a comprehensive solution that met all client requirements and exceeded expectations.`,
            },
            { type: 'h3', text: 'Scope of Work' },
            {
              type: 'p',
              text: 'The project involved detailed planning, professional installation, thorough testing, and ongoing support to ensure long-term reliability and performance.',
            },
            { type: 'h3', text: 'Results' },
            {
              type: 'p',
              text: 'The project was completed on time and within budget, with the client expressing high satisfaction with the quality of work and professionalism of our team.',
            },
          ]),
        },
      },
    })
    console.log(`  Created project: ${proj.title.slice(0, 50)}...`)
  }

  console.log('\n✅ Seed completed successfully!')
  console.log('📊 Summary:')
  console.log(`   - Categories: ${Object.keys(cats).length}`)
  console.log(`   - Clients: ${clientNames.length}`)
  console.log(`   - Services: ${services.length}`)
  console.log(`   - News: ${newsArticles.length}`)
  console.log(`   - Projects: ${projects.length}`)
  console.log(`   - Media: uploaded`)
  console.log(`   - Globals: Hero, About, Meta`)

  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
