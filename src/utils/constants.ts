export const TYPE_COLORS: Record<string, { bg: string; text: string; glow: string }> = {
  normal:   { bg: "#A8A878", text: "#fff", glow: "168,168,120" },
  fire:     { bg: "#FF6B35", text: "#fff", glow: "255,107,53" },
  water:    { bg: "#4FC3F7", text: "#fff", glow: "79,195,247" },
  electric: { bg: "#FFD600", text: "#1a1a1a", glow: "255,214,0" },
  grass:    { bg: "#4CAF50", text: "#fff", glow: "76,175,80" },
  ice:      { bg: "#80DEEA", text: "#1a1a1a", glow: "128,222,234" },
  fighting: { bg: "#C62828", text: "#fff", glow: "198,40,40" },
  poison:   { bg: "#AB47BC", text: "#fff", glow: "171,71,188" },
  ground:   { bg: "#D4A574", text: "#fff", glow: "212,165,116" },
  flying:   { bg: "#82B1FF", text: "#fff", glow: "130,177,255" },
  psychic:  { bg: "#F06292", text: "#fff", glow: "240,98,146" },
  bug:      { bg: "#8BC34A", text: "#fff", glow: "139,195,74" },
  rock:     { bg: "#BCAAA4", text: "#fff", glow: "188,170,164" },
  ghost:    { bg: "#7E57C2", text: "#fff", glow: "126,87,194" },
  dragon:   { bg: "#3949AB", text: "#fff", glow: "57,73,171" },
  dark:     { bg: "#37474F", text: "#fff", glow: "55,71,79" },
  steel:    { bg: "#90A4AE", text: "#fff", glow: "144,164,174" },
  fairy:    { bg: "#F48FB1", text: "#fff", glow: "244,143,177" },
};

export const STAT_COLORS: Record<string, string> = {
  hp:              "#FF5252",
  attack:          "#FF9800",
  defense:         "#4CAF50",
  "special-attack":"#2196F3",
  "special-defense":"#9C27B0",
  speed:           "#00BCD4",
};
export const STAT_LABELS: Record<string, string> = {
  hp:               "HP",
  attack:           "ATK",
  defense:          "DEF",
  "special-attack": "Sp.ATK",
  "special-defense":"Sp.DEF",
  speed:            "SPD",
};
