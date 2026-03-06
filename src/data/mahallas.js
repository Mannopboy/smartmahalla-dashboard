import { Droplets, Car, TreePine, Users, Wrench, Zap, AlertTriangle, Lightbulb, Trash2, Building } from "lucide-react";
export const MAHALLA_NAMES = [
  "M.Ulug'bek",
  "Voyit Haydarov",
  "Gulzor",
  "Nur",
  "Quyosh",
  "Ishonch",
  "Bobur",
  "Kimyogar",
  "Amir Temur",
  "Iftixor",
  "G'alaba",
  "Chinor",
  "A.Jomiy",
  "Kamolot",
  "Tinchlik",
  "Ma'rifat",

  "Baxt",
  "Nurobod",
  "Istiqlol",
  "Xumo",
  "Guliston",
  "Mirzog'olib",
  "Madaniyat",
  "Navruz",
  "24-Yoshlik",
];
// Real approximate coordinates for Chirchiq mahallas
const mahallaCoords = {
  "M.Ulug'bek": { lat: 41.4732, lng: 69.5780 },
  "Voyit Haydarov": { lat: 41.4710, lng: 69.5850 },
  "Gulzor": { lat: 41.4755, lng: 69.5900 },
  "Nur": { lat: 41.4680, lng: 69.5750 },
  "Quyosh": { lat: 41.4650, lng: 69.5830 },
  "Ishonch": { lat: 41.4620, lng: 69.5700 },
  "Bobur": { lat: 41.4600, lng: 69.5770 },
  "Kimyogar": { lat: 41.4770, lng: 69.5680 },
  "Amir Temur": { lat: 41.4700, lng: 69.5920 },
  "Iftixor": { lat: 41.4740, lng: 69.5730 },
  "G'alaba": { lat: 41.4660, lng: 69.5650 },
  "Chinor": { lat: 41.4720, lng: 69.5620 },
  "A.Jomiy": { lat: 41.4690, lng: 69.5960 },
  "Kamolot": { lat: 41.4630, lng: 69.5900 },
  "Tinchlik": { lat: 41.4780, lng: 69.5850 },
  "Ma'rifat": { lat: 41.4670, lng: 69.5680 },
  "Baxt": { lat: 41.4640, lng: 69.5950 },
  "Nurobod": { lat: 41.4590, lng: 69.5830 },
  "Istiqlol": { lat: 41.4750, lng: 69.5950 },
  "Xumo": { lat: 41.4800, lng: 69.5780 },
  "Guliston": { lat: 41.4610, lng: 69.5870 },
  "Mirzog'olib": { lat: 41.4580, lng: 69.5740 },
  "Madaniyat": { lat: 41.4760, lng: 69.5820 },
  "Navruz": { lat: 41.4690, lng: 69.5560 },
  "24-Yoshlik": { lat: 41.4720, lng: 69.5990 },
};
// Chirchiq center
const chirchiqCenter = { lat: 41.4689, lng: 69.5822 };
const sources = ["Telegram Bot", "Landing Page", "AI"];
const problemTemplates = [
  { title: "Suv ta'minoti to'xtatilgan", category: "Kommunal", icon: Droplets, status: "Jarayonda", priority: "Yuqori", date: "2026-03-01", description: "Suv ta'minoti uzilgan, aholiga noqulaylik.", source: "Telegram Bot" },
  { title: "Yo'l chuqurlari", category: "Yo'l", icon: Car, status: "Yangi", priority: "Yuqori", date: "2026-03-02", description: "Asosiy ko'chada chuqurlar bor.", source: "Landing Page" },
  { title: "Elektr uzilishi", category: "Kommunal", icon: Zap, status: "Bajarildi", priority: "O'rta", date: "2026-02-25", description: "Elektr uzilishi bartaraf etildi.", source: "AI" },
  { title: "Chiqindilar yig'ilmagan", category: "Ekologiya", icon: Trash2, status: "Jarayonda", priority: "O'rta", date: "2026-03-03", description: "Chiqindilar to'planib qolgan.", source: "Telegram Bot" },
  { title: "Ko'cha chiroqlari ishlamaydi", category: "Kommunal", icon: Lightbulb, status: "Yangi", priority: "O'rta", date: "2026-03-04", description: "Ko'cha yoritgichlari ishlamayapti.", source: "Landing Page" },
  { title: "Gaz quvuri eskirgan", category: "Kommunal", icon: Wrench, status: "Yangi", priority: "Yuqori", date: "2026-03-01", description: "Gaz quvurlari almashtirish kerak.", source: "AI" },
  { title: "Piyodalar yo'lkasi buzilgan", category: "Yo'l", icon: Car, status: "Yangi", priority: "O'rta", date: "2026-03-02", description: "Trotuarlar buzilgan.", source: "Telegram Bot" },
  { title: "Noqonuniy qurilish", category: "Axloq", icon: AlertTriangle, status: "Jarayonda", priority: "Yuqori", date: "2026-03-01", description: "Ruxsatsiz qurilish ishlari.", source: "Landing Page" },
  { title: "Bolalar maydonchasi buzilgan", category: "Ijtimoiy", icon: Users, status: "Yangi", priority: "O'rta", date: "2026-03-02", description: "O'yin maydonchasidagi jihozlar singan.", source: "AI" },
  { title: "Kanalizatsiya buzilgan", category: "Kommunal", icon: Droplets, status: "Yangi", priority: "Yuqori", date: "2026-03-04", description: "Kanalizatsiya quvuri yorilgan.", source: "Telegram Bot" },
  { title: "Daraxtlar qulab tushish xavfi", category: "Ekologiya", icon: TreePine, status: "Yangi", priority: "O'rta", date: "2026-03-03", description: "Eski daraxtlar xavfli holatda.", source: "Landing Page" },
  { title: "Bino fasadi nuragan", category: "Kommunal", icon: Building, status: "Jarayonda", priority: "Yuqori", date: "2026-02-28", description: "Ko'p qavatli bino fasadi tushib ketish xavfi bor.", source: "AI" },
];
// Generate problems for each mahalla deterministically
function generateProblems(mahallaName, mahallaIndex) {
  const count = 1 + (mahallaIndex % 5); // 1-5 problems per mahalla
  const problems = [];
  for (let i = 0; i < count; i++) {
    const template = problemTemplates[(mahallaIndex + i) % problemTemplates.length];
    problems.push({
      ...template,
      id: i + 1,
      mahalla: mahallaName,
    });
  }
  return problems;
}
// Seed random but deterministic
export const mahallasData = MAHALLA_NAMES.map((name, i) => {
  const coords = mahallaCoords[name] || { lat: chirchiqCenter.lat, lng: chirchiqCenter.lng };
  const complaints = 10 + ((i * 17 + 5) % 80);
  const resolved = 40 + ((i * 13 + 7) % 55);
  return {
    id: i + 1,
    name,
    lat: coords.lat,
    lng: coords.lng,
    complaints,
    resolved,
    population: 3000 + ((i * 311) % 10000),
    problems: generateProblems(name, i),
  };
});
// Derived: all problems across all mahallas with unique IDs
let globalId = 1;
export const allProblems = mahallasData.flatMap((m) => m.problems.map((p) => ({ ...p, mahalla: m.name, id: globalId++ })));
// Top problematic mahallas sorted by complaints desc
export const topMahallas = [...mahallasData].sort((a, b) => b.complaints - a.complaints).slice(0, 10);
// Status colors
export const statusColors = {
  Yangi: "bg-muted text-muted-foreground",
  Yuklandi: "bg-primary/15 text-primary",
  Jarayonda: "bg-warning/15 text-warning",
  Bajarildi: "bg-success/15 text-success",
};
export const priorityColors = {
  Yuqori: "bg-destructive/15 text-destructive",
  "O'rta": "bg-warning/15 text-warning",
  Past: "bg-muted text-muted-foreground",
};
export const categoryColors = {
  Kommunal: "bg-primary/10 text-primary",
  "Yo'l": "bg-warning/15 text-warning",
  Ekologiya: "bg-success/15 text-success",
  Axloq: "bg-destructive/10 text-destructive",
  Ijtimoiy: "bg-accent text-accent-foreground",
};
export const organizations = [
  "Kommunal xizmati",
  "Yo'l Tashkiloti",
  "Ekologiya bo'limi",
  "Axloq Vakili",
  "Maktab",
  "Bolalar bog'chasi",
  "Tibbiyot markazi",
];
