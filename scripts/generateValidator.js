import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import standaloneCode from 'ajv/dist/standalone/index.js'
import Ajv from 'ajv'

async function generateValidator() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const ajv = new Ajv({ code: { source: true, esm: true } })

  const schemaPath = path.resolve(__dirname, '../app/schema.json')
  const schemaText = await fs.readFile(schemaPath, 'utf8')
  const schema = JSON.parse(schemaText)

  const validate = ajv.compile(schema)
  const moduleCode = standaloneCode(ajv, validate)

  await fs.writeFile(
    path.resolve(__dirname, '../app/validator.js'),
    moduleCode,
  )
  console.log('Standalone validation module generated as validator.js')
}

generateValidator().catch(console.error)
