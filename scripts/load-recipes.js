import fs from 'fs'
import path from 'path'

const file = path.join(__dirname, '..', 'backend', 'recipes.json')

const rawData = fs.readFileSync(file)
