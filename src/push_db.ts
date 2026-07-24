import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'

async function main() {
  const payload = await getPayload({ config })
  console.log('Database schema pushed successfully!')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
