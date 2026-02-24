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
 * Detects the main object in an image element.
 * @param {HTMLImageElement} imageElement
 * @returns {Promise<{name: string, confidence: number} | null>}
 */
export async function detectMainObject(imageElement) {
  await initializeBackendIfNeeded();
  const model = await loadModelIfNeeded();
  const predictions = await model.detect(imageElement);

  // If "person" appears, try to ignore it. since their confidence will be higher than object. 
  const predictionsWithoutPeople = predictions.filter((p) => p.class !== "person");
  const best = getBestPrediction(predictionsWithoutPeople.length ? predictionsWithoutPeople : predictions);

  if (!best) return null;

  return {
    name: best.class,
    confidence: best.score,
  };
}