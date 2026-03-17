/**
 * COCO-SSD object detection helper.
 * Loads the model once (the first time you call it), then reuses it.
 */

import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";

let loadedModel = null;
let backendInitialized = false;

/** Initializes the TensorFlow.js backend (only once).
 * This is needed to avoid errors about "backend not found" when loading the model.
 */
async function initializeBackendIfNeeded() {
  if (backendInitialized) return;

  try {
    await tf.setBackend("webgl");
  } catch (e) {
    console.warn("WebGL backend not available, falling back to CPU. Error:", e);
    await tf.setBackend("cpu");
  }
  backendInitialized = true;
}

/**
 * Loads the COCO-SSD model (only once).
 */
async function loadModelIfNeeded() {
  if (loadedModel) return loadedModel;

  const cocoSsd = await import("@tensorflow-models/coco-ssd");
  loadedModel = await cocoSsd.load();
  return loadedModel;
}

/**
 * Finds the highest-confidence prediction.
 */
function getBestPrediction(predictions) {
  if (!predictions || predictions.length === 0) return null;

  let best = predictions[0];
  for (const prediction of predictions) {
    if (prediction.score > best.score) best = prediction;
  }
  return best;
}

/**
 * Detects top N objects in an image element.
 * @param {HTMLImageElement} imageElement
 * @param {{ topK?: number, ignorePerson?: boolean, minScore?: number }} options
 * @returns {Promise<Array<{ name: string, confidence: number }>>}
 */
export async function detectTopObjects(imageElement, options = {}) {
  const { topK = 5, ignorePerson = true, minScore = 0.0 } = options;

  await initializeBackendIfNeeded();
  const model = await loadModelIfNeeded();

  const predictions = await model.detect(imageElement);

  // 1) basic filtering (score)
  const filtered = (predictions || [])
    .filter((p) => p && typeof p.score === "number")
    .filter((p) => p.score >= minScore);

  // 2) optional: ignore person, but FALLBACK to person if nothing else exists
  const withoutPerson = filtered.filter((p) => p.class !== "person");
  const finalList =
    ignorePerson && withoutPerson.length > 0 ? withoutPerson : filtered;

  // 3) sort + take topK
  return finalList
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((p) => ({
      name: p.class,
      confidence: p.score,
    }));
}

/**
 * Backwards compatible helper: returns best object only.
 */
export async function detectMainObject(imageElement) {
  const top = await detectTopObjects(imageElement, { topK: 1, ignorePerson: true });
  return top.length ? top[0] : null;
}