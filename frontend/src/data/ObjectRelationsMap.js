/**
 * ObjectRelationsMap.js
 *
 * Derives object-to-object relationships from shared human rights themes.
 * Two objects are "related" if they appear under at least one of the same themes
 * in ObjectThemeMap. The more themes they share, the stronger the connection.
 *
 * Usage:
 *   import { getRelatedObjects } from "./ObjectRelationsMap.js";
 *   const related = getRelatedObjects("suitcase"); // returns array of object records
 */

import { objects } from "./Objects.js";
import { objectThemeMap } from "./ObjectThemeMap.js";

/**
 * Returns an array of object records related to the given objectId,
 * sorted by number of shared themes (most related first).
 *
 * @param {string} objectId - The id of the source object (e.g. "suitcase")
 * @param {object} options
 * @param {number} options.limit - Max number of results (default: 6)
 * @param {number} options.minShared - Minimum shared themes required (default: 1)
 * @returns {Array<{ id, en, fr, icon, sharedThemes }>}
 */
export function getRelatedObjects(objectId, { limit = 6, minShared = 1 } = {}) {
  const sourceThemes = objectThemeMap[objectId] || [];
  if (!sourceThemes.length) return [];

  const sourceSet = new Set(sourceThemes);

  return objects
    .filter((obj) => obj.id !== objectId && objectThemeMap[obj.id])
    .map((obj) => {
      const sharedThemes = (objectThemeMap[obj.id] || []).filter((t) =>
        sourceSet.has(t)
      );
      return { ...obj, sharedThemes };
    })
    .filter(({ sharedThemes }) => sharedThemes.length >= minShared)
    .sort((a, b) => b.sharedThemes.length - a.sharedThemes.length)
    .slice(0, limit);
}
