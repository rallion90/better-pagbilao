// One-off (re-runnable) optimizer for full-resolution source photos dropped
// into public/. The hero slider images in particular were straight-off-camera
// exports (5328x4000, 2.8-5.5MB each) served eagerly/at high fetchPriority as
// the page's LCP element — on anything but a fast connection they'd still be
// downloading well after the rest of the page painted, which reads as "the
// image is broken." Re-encodes them in place at a sane web width/quality.
import sharp from "sharp"
import { stat, rename } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const MAX_WIDTH = 1920
const JPEG_QUALITY = 78

const targets = [
  "public/hero/pagbilao-grande-island.jpg",
  "public/hero/maharlika-highway-pagbilao.jpg",
  "public/hero/diversion-road-pagbilao.jpg",
]

async function optimize(relativePath) {
  const absolutePath = path.join(ROOT, relativePath)
  const before = (await stat(absolutePath)).size

  const buffer = await sharp(absolutePath)
    .rotate() // apply EXIF orientation, then strip metadata below
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer()

  const tempPath = `${absolutePath}.tmp`
  await sharp(buffer).toFile(tempPath)
  await rename(tempPath, absolutePath)
  const after = (await stat(absolutePath)).size

  const beforeMb = (before / 1024 / 1024).toFixed(2)
  const afterMb = (after / 1024 / 1024).toFixed(2)
  const reduction = (100 - (after / before) * 100).toFixed(0)
  console.log(`  ${relativePath}: ${beforeMb}MB -> ${afterMb}MB (-${reduction}%)`)
}

async function main() {
  console.log(`Optimizing ${targets.length} image(s)...`)
  for (const target of targets) {
    await optimize(target)
  }
  console.log("Done.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
