export const promptsByThemes = {
  culture_identity: [
    "How can everyday objects reflect a person’s identity?",
    "What objects help people stay connected to their culture?",
    "How might an object carry personal or family meaning?"
  ],
  deportation: [
    "What would it feel like to leave home without choice?",
    "What objects might become most important during forced movement?",
    "How can one object represent loss, separation, or survival?"
  ],
  discrimination: [
    "How can access to everyday objects be shaped by unfair treatment?",
    "What objects can reveal who is included and who is excluded?",
    "How might an ordinary object connect to unequal opportunities?"
  ],
  disability: [
    "How can objects support accessibility and independence?",
    "What happens when everyday spaces or tools are not designed for everyone?",
    "How do accessible objects help people participate fully in daily life?"
  ],
  indigenous: [
    "How can objects connect people to land, language, and community?",
    "What objects help preserve culture across generations?",
    "How might an object reflect resilience and continuity?"
  ],
  children: [
    "What objects are important in a child’s daily life?",
    "How do objects relate to safety, learning, and care?",
    "What can ordinary belongings reveal about childhood experiences?"
  ],
  labour: [
    "Who made the objects we use every day?",
    "What working conditions might be connected to this object?",
    "How can an everyday item reflect fairness, safety, or exploitation at work?"
  ],
  political: [
    "How can ordinary objects become symbols of protest or power?",
    "What objects are often connected to political voice or participation?",
    "How might an object represent resistance, control, or change?"
  ],
  refugee: [
    "What object would you carry if you had to leave home quickly?",
    "How might one everyday object become essential during displacement?",
    "What can an object reveal about safety, uncertainty, or belonging?"
  ],
  women: [
    "How can everyday objects reflect gender roles or expectations?",
    "What objects can reveal differences in freedom, opportunity, or safety?",
    "How might an ordinary object connect to women’s rights?"
  ],
  sexual_orientation: [
    "How can objects express identity, safety, or visibility?",
    "What everyday spaces or belongings can affect whether someone feels accepted?",
    "How might an object connect to inclusion or exclusion?"
  ],
  gender_identity: [
    "How can objects help people express who they are?",
    "What role can clothing, symbols, or personal belongings play in identity?",
    "How might access to everyday items affect dignity and self-expression?"
  ],
  religion: [
    "How can objects support spiritual practice and belonging?",
    "What objects help people express faith in everyday life?",
    "How might an object connect to religious freedom?"
  ],
  education: [
    "What objects help people learn and share knowledge?",
    "How does access to learning tools shape opportunity?",
    "What can everyday learning objects reveal about fairness in education?"
  ],
  migrant: [
    "How do everyday objects change meaning when someone moves to a new place?",
    "What belongings might matter most during migration?",
    "How can an object reflect work, separation, or adaptation?"
  ],
  health: [
    "How can ordinary objects affect health and well-being?",
    "What does access to basic care-related items reveal about rights and inequality?",
    "How might an object connect to safety, illness, or support?"
  ],
  shelter: [
    "What objects help make a place feel safe or livable?",
    "How can everyday belongings reflect housing insecurity?",
    "What does home mean when shelter is uncertain?"
  ],
  standard_of_living: [
    "What everyday objects are necessary for a decent standard of living?",
    "How can access to ordinary items reflect inequality?",
    "What does this object suggest about comfort, survival, or dignity?"
  ]
};

export function getPromptsForTheme(themeId) {
  return promptsByTheme[themeId] || [];
}
