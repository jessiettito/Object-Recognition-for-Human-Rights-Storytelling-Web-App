export const objectThemeMap = {
  passport_id: ["culture_identity", "migrant", "refugee"],
  suitcase: ["migrant", "refugee", "deportation"],
  letter: ["culture_identity", "political", "women"],
  photograph: ["culture_identity", "indigenous", "children"],
  newspaper: ["political", "discrimination", "education"],
  poster: ["political", "discrimination", "labour"],
  radio: ["political", "education", "culture_identity"],
  book: ["education", "culture_identity", "religion"],
  badge: ["political", "discrimination", "labour"],
  shoe: ["migrant", "refugee", "standard_of_living"],
  blanket: ["shelter", "health", "refugee"],
  phone: ["migrant", "political", "culture_identity"],
};

export function getThemeIdsForObject(objectId) {
  return objectThemeMap[objectId] || [];
}