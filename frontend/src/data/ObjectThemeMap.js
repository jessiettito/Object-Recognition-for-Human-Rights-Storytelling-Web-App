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
  cup: ["standard_of_living", "culture_identity", "health"],
  water_bottle: ["health", "standard_of_living", "indigenous"],
  backpack: ["education", "children", "migrant"],
  laptop: ["education", "labour", "political"],
  remote: ["education", "political", "culture_identity"],
  tv: ["political", "culture_identity", "education"],
  glasses: ["health", "disability", "education"],
  medicine: ["health", "standard_of_living", "disability"],
  wallet: ["labour", "standard_of_living", "migrant"],
  watch: ["labour", "standard_of_living", "political"],
  bicycle: ["health", "labour", "standard_of_living"],
  food_plate: ["health", "standard_of_living", "children"],
  school_bag: ["education", "children", "discrimination"],
  headphones: ["culture_identity", "education", "political"]
};

export function getThemeIdsForObject(objectId) {
  return objectThemeMap[objectId] || [];
}