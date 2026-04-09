/**
 * useVideoRenderer.js
 *
 * Renders a human-rights story card as a 1080×1920 portrait WebM video
 * using the HTML5 Canvas API + MediaRecorder API — no external libraries.
 *
 * How it works:
 *  1. Create an off-screen canvas (not attached to the DOM)
 *  2. Call canvas.captureStream(30) to get a live 30fps MediaStream
 *  3. Feed that stream into a MediaRecorder, which encodes it as WebM
 *  4. Run a requestAnimationFrame loop that draws each frame onto the canvas
 *     — elements animate in over ~12 seconds using elapsed-time math
 *  5. Stop the recorder → stitch chunks into a Blob → trigger download
 */

import { ref } from 'vue'

const CANVAS_W = 1080
const CANVAS_H = 1920
const DURATION_MS = 12_000
const FPS = 30

// ─── math helpers ──────────────────────────────────────────────────────────

function clamp(v, lo = 0, hi = 1) {
  return Math.max(lo, Math.min(hi, v))
}

/** Smooth deceleration curve (starts fast, slows to stop) */
function easeOut(t) {
  return 1 - (1 - t) * (1 - t)
}

/**
 * Returns an alpha value (0→1) for a fade-in that starts at `startMs`
 * and completes over `dur` milliseconds.
 */
function fadeIn(tMs, startMs, dur = 600) {
  return clamp((tMs - startMs) / dur)
}

// ─── canvas helpers ─────────────────────────────────────────────────────────

/**
 * Wraps `text` into lines that fit within `maxWidth` pixels.
 * You must set ctx.font before calling this.
 */
function wrapText(ctx, text, maxWidth) {
  if (!text) return []
  const words = text.split(/\s+/)
  const lines = []
  let line = ''
  for (const word of words) {
    const test = line ? line + ' ' + word : word
    if (ctx.measureText(test).width <= maxWidth) {
      line = test
    } else {
      if (line) lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  return lines
}

/** Draws a rounded rectangle path (no fill/stroke — call those after). */
function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// ─── frame drawing ──────────────────────────────────────────────────────────

/**
 * Draws a single video frame onto `ctx` for the given elapsed time `t` (ms).
 * storyData: { title, category, summary, themeLabels, language }
 */
function drawFrame(ctx, t, { title, category, summary, themeLabels, language }) {
  const W = CANVAS_W
  const H = CANVAS_H

  // ── Background ────────────────────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, W * 0.4, H)
  bg.addColorStop(0, '#0f172a')
  bg.addColorStop(0.65, '#111827')
  bg.addColorStop(1, '#1e1b4b')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Soft radial glow in top-right corner
  const glow = ctx.createRadialGradient(W * 0.88, H * 0.07, 0, W * 0.88, H * 0.07, W * 0.7)
  glow.addColorStop(0, 'rgba(147,197,253,0.10)')
  glow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  // ── Gold/blue accent line (top) ───────────────────────────────────────────
  {
    const a = fadeIn(t, 0, 400)
    if (a > 0) {
      ctx.save()
      ctx.globalAlpha = a
      const grad = ctx.createLinearGradient(60, 0, W * 0.52, 0)
      grad.addColorStop(0, '#f4bf38')
      grad.addColorStop(0.55, '#93c5fd')
      grad.addColorStop(1, 'rgba(147,197,253,0)')
      ctx.strokeStyle = grad
      ctx.lineWidth = 5
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(60, 112)
      ctx.lineTo(W * 0.52, 112)
      ctx.stroke()
      ctx.restore()
    }
  }

  // ── CMHR branding label ───────────────────────────────────────────────────
  {
    const a = fadeIn(t, 150, 600)
    if (a > 0) {
      ctx.save()
      ctx.globalAlpha = a
      ctx.font = '700 28px Arial, Helvetica, sans-serif'
      ctx.fillStyle = '#93c5fd'
      const label = language === 'fr'
        ? 'MUSÉE CANADIEN POUR LES DROITS DE LA PERSONNE'
        : 'CANADIAN MUSEUM FOR HUMAN RIGHTS'
      ctx.fillText(label, 60, 92)
      ctx.restore()
    }
  }

  // ── Category label ────────────────────────────────────────────────────────
  {
    const a = fadeIn(t, 900, 700)
    if (a > 0) {
      const slide = (1 - easeOut(clamp((t - 900) / 700))) * 22
      ctx.save()
      ctx.globalAlpha = a
      ctx.font = '700 36px Arial, Helvetica, sans-serif'
      ctx.fillStyle = '#fde68a'
      ctx.fillText((category || '').toUpperCase(), 60, 192 + slide)
      ctx.restore()
    }
  }

  // ── Story title (large serif) ─────────────────────────────────────────────
  // We calculate the title's bottom edge so summary can sit below it.
  const TITLE_START_Y = 310
  const TITLE_LINE_HEIGHT = 108
  let titleBottomY = TITLE_START_Y + TITLE_LINE_HEIGHT + 30 // fallback

  {
    const a = fadeIn(t, 1600, 800)
    ctx.save()
    ctx.font = '900 90px Georgia, "Times New Roman", serif'
    const lines = wrapText(ctx, title || '', W - 120)
    titleBottomY = TITLE_START_Y + lines.length * TITLE_LINE_HEIGHT + 30

    if (a > 0) {
      const slide = (1 - easeOut(clamp((t - 1600) / 800))) * 34
      ctx.globalAlpha = a
      ctx.fillStyle = '#f8fafc'
      lines.forEach((line, i) => {
        ctx.fillText(line, 60, TITLE_START_Y + i * TITLE_LINE_HEIGHT + slide)
      })
    }
    ctx.restore()
  }

  // ── Divider rule below title ──────────────────────────────────────────────
  {
    const a = fadeIn(t, 2500, 500)
    if (a > 0) {
      ctx.save()
      ctx.globalAlpha = a * 0.3
      const grad = ctx.createLinearGradient(60, 0, W - 60, 0)
      grad.addColorStop(0, '#93c5fd')
      grad.addColorStop(1, 'rgba(147,197,253,0)')
      ctx.strokeStyle = grad
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(60, titleBottomY)
      ctx.lineTo(W - 60, titleBottomY)
      ctx.stroke()
      ctx.restore()
    }
  }

  // ── Summary text ──────────────────────────────────────────────────────────
  {
    const a = fadeIn(t, 3200, 900)
    if (a > 0) {
      const summaryStartY = Math.max(titleBottomY + 64, 660)
      ctx.save()
      ctx.globalAlpha = a
      ctx.font = '400 46px Georgia, "Times New Roman", serif'
      ctx.fillStyle = '#cbd5e1'
      const lines = wrapText(ctx, summary || '', W - 120)
      const lh = 70
      lines.forEach((line, i) => {
        ctx.fillText(line, 60, summaryStartY + i * lh)
      })
      ctx.restore()
    }
  }

  // ── Theme pills ───────────────────────────────────────────────────────────
  {
    const a = fadeIn(t, 7400, 700)
    if (a > 0) {
      ctx.save()
      ctx.globalAlpha = a
      ctx.font = '600 26px Arial, Helvetica, sans-serif'
      let px = 60
      const py = H - 440
      const pillH = 52
      const hPad = 24

      for (const label of (themeLabels || []).slice(0, 4)) {
        const text = label.toUpperCase()
        const tw = ctx.measureText(text).width
        const pillW = tw + hPad * 2

        if (px + pillW > W - 60) break

        ctx.fillStyle = 'rgba(147,197,253,0.13)'
        roundRectPath(ctx, px, py, pillW, pillH, pillH / 2)
        ctx.fill()

        ctx.strokeStyle = 'rgba(147,197,253,0.30)'
        ctx.lineWidth = 2
        roundRectPath(ctx, px, py, pillW, pillH, pillH / 2)
        ctx.stroke()

        ctx.fillStyle = '#93c5fd'
        ctx.fillText(text, px + hPad, py + pillH / 2 + 9)

        px += pillW + 16
      }
      ctx.restore()
    }
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  {
    const a = fadeIn(t, 9000, 900)
    if (a > 0) {
      ctx.save()

      // Semi-transparent footer gradient so text is legible
      ctx.globalAlpha = a
      const footerFade = ctx.createLinearGradient(0, H - 320, 0, H)
      footerFade.addColorStop(0, 'rgba(15,23,42,0)')
      footerFade.addColorStop(0.25, 'rgba(15,23,42,0.92)')
      footerFade.addColorStop(1, '#0f172a')
      ctx.fillStyle = footerFade
      ctx.fillRect(0, H - 320, W, 320)

      // Gold accent line
      ctx.globalAlpha = a * 0.75
      const lineGrad = ctx.createLinearGradient(60, 0, 480, 0)
      lineGrad.addColorStop(0, '#f4bf38')
      lineGrad.addColorStop(1, 'rgba(244,191,56,0)')
      ctx.strokeStyle = lineGrad
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(60, H - 212)
      ctx.lineTo(480, H - 212)
      ctx.stroke()

      ctx.globalAlpha = a
      ctx.font = '400 32px Arial, Helvetica, sans-serif'
      ctx.fillStyle = '#64748b'
      ctx.fillText(language === 'fr' ? 'En savoir plus :' : 'Learn more:', 60, H - 166)

      ctx.font = '700 44px Arial, Helvetica, sans-serif'
      ctx.fillStyle = '#93c5fd'
      ctx.fillText('humanrights.ca', 60, H - 104)

      ctx.restore()
    }
  }
}

// ─── composable ─────────────────────────────────────────────────────────────

export function useVideoRenderer() {
  const isRendering = ref(false)
  const progress = ref(0)

  /**
   * Render and download a story video.
   * @param {{ title: string, category: string, summary: string, themeLabels: string[], language: string }} storyData
   */
  async function renderVideo(storyData) {
    isRendering.value = true
    progress.value = 0

    // Wait for any web fonts already loaded by the page to be available to Canvas
    await document.fonts.ready

    const canvas = document.createElement('canvas')
    canvas.width = CANVAS_W
    canvas.height = CANVAS_H
    const ctx = canvas.getContext('2d')

    // Pick the best supported codec
    const mimeType = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(
      (t) => MediaRecorder.isTypeSupported(t)
    ) || 'video/webm'

    // captureStream gives us a live MediaStream of whatever is drawn on canvas
    const stream = canvas.captureStream(FPS)
    const chunks = []

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 4_000_000,
    })

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data)
    }

    return new Promise((resolve, reject) => {
      recorder.onstop = () => {
        try {
          const blob = new Blob(chunks, { type: 'video/webm' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${(storyData.title || 'story')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase()}.webm`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          setTimeout(() => URL.revokeObjectURL(url), 2000)
          isRendering.value = false
          progress.value = 100
          resolve()
        } catch (err) {
          isRendering.value = false
          reject(err)
        }
      }

      recorder.onerror = (e) => {
        isRendering.value = false
        reject(e.error || new Error('MediaRecorder error'))
      }

      // Start recording — collect data in 200ms segments
      recorder.start(200)

      const startTime = performance.now()

      function tick(now) {
        const elapsed = now - startTime

        if (elapsed >= DURATION_MS) {
          progress.value = 99
          recorder.stop()
          return
        }

        progress.value = Math.min(Math.round((elapsed / DURATION_MS) * 100), 99)
        drawFrame(ctx, elapsed, storyData)

        requestAnimationFrame(tick)
      }

      requestAnimationFrame(tick)
    })
  }

  return { isRendering, progress, renderVideo }
}
