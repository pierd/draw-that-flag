export type Continent =
  | 'Europe'
  | 'Asia'
  | 'Africa'
  | 'North America'
  | 'South America'
  | 'Oceania';

export interface Country {
  name: string;
  isoCode: string;
  continent: Continent;
  aspectRatio: number; // width / height, e.g., 4/3 for most flags
  colors: string[]; // 3-6 prominent hex colors for drawing
}

// 100 curated countries with recognizable flags
// Colors are extracted from flag-icons SVG files to match comparison
export const countries: Country[] = [
  // Europe (20 countries)
  { name: 'France', isoCode: 'fr', continent: 'Europe', aspectRatio: 3 / 2, colors: ['#000091', '#FFFFFF', '#E1000F'] },
  { name: 'Germany', isoCode: 'de', continent: 'Europe', aspectRatio: 5 / 3, colors: ['#000000', '#FF0000', '#FFCC00'] },
  { name: 'Italy', isoCode: 'it', continent: 'Europe', aspectRatio: 3 / 2, colors: ['#009246', '#FFFFFF', '#CE2B37'] },
  { name: 'Spain', isoCode: 'es', continent: 'Europe', aspectRatio: 3 / 2, colors: ['#AA151B', '#F1BF00', '#FFFFFF'] },
  { name: 'United Kingdom', isoCode: 'gb', continent: 'Europe', aspectRatio: 2 / 1, colors: ['#012169', '#FFFFFF', '#C8102E'] },
  { name: 'Netherlands', isoCode: 'nl', continent: 'Europe', aspectRatio: 3 / 2, colors: ['#AE1C28', '#FFFFFF', '#21468B'] },
  { name: 'Belgium', isoCode: 'be', continent: 'Europe', aspectRatio: 15 / 13, colors: ['#000000', '#FFD90C', '#F31830'] },
  { name: 'Poland', isoCode: 'pl', continent: 'Europe', aspectRatio: 8 / 5, colors: ['#FFFFFF', '#DC143C'] },
  { name: 'Sweden', isoCode: 'se', continent: 'Europe', aspectRatio: 8 / 5, colors: ['#005293', '#FECB00'] },
  { name: 'Norway', isoCode: 'no', continent: 'Europe', aspectRatio: 22 / 16, colors: ['#ED2939', '#FFFFFF', '#002664'] },
  { name: 'Denmark', isoCode: 'dk', continent: 'Europe', aspectRatio: 37 / 28, colors: ['#C8102E', '#FFFFFF'] },
  { name: 'Finland', isoCode: 'fi', continent: 'Europe', aspectRatio: 18 / 11, colors: ['#FFFFFF', '#002F6C'] },
  { name: 'Austria', isoCode: 'at', continent: 'Europe', aspectRatio: 3 / 2, colors: ['#C8102E', '#FFFFFF'] },
  { name: 'Switzerland', isoCode: 'ch', continent: 'Europe', aspectRatio: 1 / 1, colors: ['#FF0000', '#FFFFFF'] },
  { name: 'Portugal', isoCode: 'pt', continent: 'Europe', aspectRatio: 3 / 2, colors: ['#006600', '#FF0000', '#FFFF00', '#FFFFFF'] },
  { name: 'Greece', isoCode: 'gr', continent: 'Europe', aspectRatio: 3 / 2, colors: ['#0D5EAF', '#FFFFFF'] },
  { name: 'Ireland', isoCode: 'ie', continent: 'Europe', aspectRatio: 2 / 1, colors: ['#009A49', '#FFFFFF', '#FF7900'] },
  { name: 'Czech Republic', isoCode: 'cz', continent: 'Europe', aspectRatio: 3 / 2, colors: ['#FFFFFF', '#D7141A', '#11457E'] },
  { name: 'Ukraine', isoCode: 'ua', continent: 'Europe', aspectRatio: 3 / 2, colors: ['#0057B8', '#FFD700'] },
  { name: 'Romania', isoCode: 'ro', continent: 'Europe', aspectRatio: 3 / 2, colors: ['#00319C', '#FFDE00', '#DE2110'] },

  // Asia (20 countries)
  { name: 'Japan', isoCode: 'jp', continent: 'Asia', aspectRatio: 3 / 2, colors: ['#FFFFFF', '#BC002D'] },
  { name: 'South Korea', isoCode: 'kr', continent: 'Asia', aspectRatio: 3 / 2, colors: ['#FFFFFF', '#CD2E3A', '#0047A0', '#000000'] },
  { name: 'China', isoCode: 'cn', continent: 'Asia', aspectRatio: 3 / 2, colors: ['#EE1C25', '#FFFF00'] },
  { name: 'India', isoCode: 'in', continent: 'Asia', aspectRatio: 3 / 2, colors: ['#FF9933', '#FFFFFF', '#128807', '#000080'] },
  { name: 'Indonesia', isoCode: 'id', continent: 'Asia', aspectRatio: 3 / 2, colors: ['#E70011', '#FFFFFF'] },
  { name: 'Vietnam', isoCode: 'vn', continent: 'Asia', aspectRatio: 3 / 2, colors: ['#DA251D', '#FFFF00'] },
  { name: 'Thailand', isoCode: 'th', continent: 'Asia', aspectRatio: 3 / 2, colors: ['#A51931', '#F4F5F8', '#2D2A4A'] },
  { name: 'Philippines', isoCode: 'ph', continent: 'Asia', aspectRatio: 2 / 1, colors: ['#0038A8', '#CE1126', '#FFFFFF', '#FCD116'] },
  { name: 'Malaysia', isoCode: 'my', continent: 'Asia', aspectRatio: 2 / 1, colors: ['#CC0000', '#FFFFFF', '#000066', '#FFCC00'] },
  { name: 'Singapore', isoCode: 'sg', continent: 'Asia', aspectRatio: 3 / 2, colors: ['#DF0000', '#FFFFFF'] },
  { name: 'Pakistan', isoCode: 'pk', continent: 'Asia', aspectRatio: 3 / 2, colors: ['#0C590B', '#FFFFFF'] },
  { name: 'Bangladesh', isoCode: 'bd', continent: 'Asia', aspectRatio: 5 / 3, colors: ['#006A4E', '#F42A41'] },
  { name: 'Turkey', isoCode: 'tr', continent: 'Asia', aspectRatio: 3 / 2, colors: ['#E30A17', '#FFFFFF'] },
  { name: 'Saudi Arabia', isoCode: 'sa', continent: 'Asia', aspectRatio: 3 / 2, colors: ['#165D31', '#FFFFFF'] },
  { name: 'United Arab Emirates', isoCode: 'ae', continent: 'Asia', aspectRatio: 2 / 1, colors: ['#00732F', '#FFFFFF', '#000000', '#FF0000'] },
  { name: 'Israel', isoCode: 'il', continent: 'Asia', aspectRatio: 11 / 8, colors: ['#FFFFFF', '#0038B8'] },
  { name: 'Iran', isoCode: 'ir', continent: 'Asia', aspectRatio: 7 / 4, colors: ['#239F40', '#FFFFFF', '#DA0000'] },
  { name: 'Iraq', isoCode: 'iq', continent: 'Asia', aspectRatio: 3 / 2, colors: ['#CE1126', '#FFFFFF', '#000000', '#007A3D'] },
  { name: 'Nepal', isoCode: 'np', continent: 'Asia', aspectRatio: 5 / 4, colors: ['#CE0000', '#FFFFFF'] },
  { name: 'Sri Lanka', isoCode: 'lk', continent: 'Asia', aspectRatio: 2 / 1, colors: ['#8D2029', '#FFB700', '#005641', '#FF5B00'] },

  // Africa (20 countries)
  { name: 'South Africa', isoCode: 'za', continent: 'Africa', aspectRatio: 3 / 2, colors: ['#007847', '#FFB915', '#E1392D', '#000C8A', '#FFFFFF', '#000000'] },
  { name: 'Egypt', isoCode: 'eg', continent: 'Africa', aspectRatio: 3 / 2, colors: ['#CE1126', '#FFFFFF', '#000000', '#C09300'] },
  { name: 'Nigeria', isoCode: 'ng', continent: 'Africa', aspectRatio: 2 / 1, colors: ['#008753', '#FFFFFF'] },
  { name: 'Kenya', isoCode: 'ke', continent: 'Africa', aspectRatio: 3 / 2, colors: ['#000000', '#BB0000', '#006600', '#FFFFFF'] },
  { name: 'Ethiopia', isoCode: 'et', continent: 'Africa', aspectRatio: 2 / 1, colors: ['#298C08', '#FFC621', '#EF2118', '#006BC6'] },
  { name: 'Ghana', isoCode: 'gh', continent: 'Africa', aspectRatio: 3 / 2, colors: ['#CE1126', '#FCD116', '#006B3F', '#000000'] },
  { name: 'Morocco', isoCode: 'ma', continent: 'Africa', aspectRatio: 3 / 2, colors: ['#C1272D'] },
  { name: 'Algeria', isoCode: 'dz', continent: 'Africa', aspectRatio: 3 / 2, colors: ['#006233', '#FFFFFF', '#D21034'] },
  { name: 'Tunisia', isoCode: 'tn', continent: 'Africa', aspectRatio: 3 / 2, colors: ['#E70013', '#FFFFFF'] },
  { name: 'Libya', isoCode: 'ly', continent: 'Africa', aspectRatio: 2 / 1, colors: ['#E70013', '#000000', '#239E46', '#FFFFFF'] },
  { name: 'Senegal', isoCode: 'sn', continent: 'Africa', aspectRatio: 3 / 2, colors: ['#0B7226', '#FFFF00', '#BC0000'] },
  { name: 'Ivory Coast', isoCode: 'ci', continent: 'Africa', aspectRatio: 3 / 2, colors: ['#FF9A00', '#FFFFFF', '#00CD00'] },
  { name: 'Cameroon', isoCode: 'cm', continent: 'Africa', aspectRatio: 3 / 2, colors: ['#007A5E', '#CE1126', '#FCD116'] },
  { name: 'Tanzania', isoCode: 'tz', continent: 'Africa', aspectRatio: 3 / 2, colors: ['#009900', '#FFFF00', '#000000', '#0099FF'] },
  { name: 'Uganda', isoCode: 'ug', continent: 'Africa', aspectRatio: 3 / 2, colors: ['#000000', '#FFE700', '#DE3108', '#FFFFFF'] },
  { name: 'Zimbabwe', isoCode: 'zw', continent: 'Africa', aspectRatio: 2 / 1, colors: ['#006400', '#FFD200', '#D40000', '#000000', '#FFFFFF'] },
  { name: 'Rwanda', isoCode: 'rw', continent: 'Africa', aspectRatio: 3 / 2, colors: ['#00A1DE', '#FAD201', '#20603D'] },
  { name: 'Madagascar', isoCode: 'mg', continent: 'Africa', aspectRatio: 3 / 2, colors: ['#FFFFFF', '#FC3D32', '#007E3A'] },
  { name: 'Mozambique', isoCode: 'mz', continent: 'Africa', aspectRatio: 3 / 2, colors: ['#009A00', '#FFFFFF', '#000000', '#FFCA00', '#FF0000'] },
  { name: 'Angola', isoCode: 'ao', continent: 'Africa', aspectRatio: 3 / 2, colors: ['#FF0000', '#000000', '#FFEC00'] },

  // North America (15 countries)
  { name: 'United States', isoCode: 'us', continent: 'North America', aspectRatio: 19 / 10, colors: ['#BD3D44', '#FFFFFF', '#192F5D'] },
  { name: 'Canada', isoCode: 'ca', continent: 'North America', aspectRatio: 2 / 1, colors: ['#D52B1E', '#FFFFFF'] },
  { name: 'Mexico', isoCode: 'mx', continent: 'North America', aspectRatio: 7 / 4, colors: ['#006847', '#FFFFFF', '#CE1126'] },
  { name: 'Cuba', isoCode: 'cu', continent: 'North America', aspectRatio: 2 / 1, colors: ['#002A8F', '#FFFFFF', '#CB1515'] },
  { name: 'Jamaica', isoCode: 'jm', continent: 'North America', aspectRatio: 2 / 1, colors: ['#009900', '#000000', '#FFCC00'] },
  { name: 'Haiti', isoCode: 'ht', continent: 'North America', aspectRatio: 5 / 3, colors: ['#00209F', '#D21034', '#FFFFFF', '#016A16'] },
  { name: 'Dominican Republic', isoCode: 'do', continent: 'North America', aspectRatio: 5 / 3, colors: ['#002D62', '#CE1126', '#FFFFFF'] },
  { name: 'Panama', isoCode: 'pa', continent: 'North America', aspectRatio: 3 / 2, colors: ['#FFFFFF', '#D80000', '#0000AB'] },
  { name: 'Costa Rica', isoCode: 'cr', continent: 'North America', aspectRatio: 5 / 3, colors: ['#0000B4', '#FFFFFF', '#D90000'] },
  { name: 'Guatemala', isoCode: 'gt', continent: 'North America', aspectRatio: 8 / 5, colors: ['#4997D0', '#FFFFFF'] },
  { name: 'Honduras', isoCode: 'hn', continent: 'North America', aspectRatio: 2 / 1, colors: ['#18C3DF', '#FFFFFF'] },
  { name: 'El Salvador', isoCode: 'sv', continent: 'North America', aspectRatio: 189 / 107, colors: ['#00209F', '#FFFFFF'] },
  { name: 'Nicaragua', isoCode: 'ni', continent: 'North America', aspectRatio: 5 / 3, colors: ['#0067C6', '#FFFFFF'] },
  { name: 'Trinidad and Tobago', isoCode: 'tt', continent: 'North America', aspectRatio: 5 / 3, colors: ['#E00000', '#FFFFFF', '#000000'] },
  { name: 'Bahamas', isoCode: 'bs', continent: 'North America', aspectRatio: 2 / 1, colors: ['#08CED6', '#FFE900', '#000000'] },

  // South America (10 countries)
  { name: 'Brazil', isoCode: 'br', continent: 'South America', aspectRatio: 10 / 7, colors: ['#229E45', '#F8E509', '#2B49A3', '#FFFFFF'] },
  { name: 'Argentina', isoCode: 'ar', continent: 'South America', aspectRatio: 8 / 5, colors: ['#74ACDF', '#FFFFFF', '#F6B40E'] },
  { name: 'Colombia', isoCode: 'co', continent: 'South America', aspectRatio: 3 / 2, colors: ['#FFE800', '#00148E', '#DA0010'] },
  { name: 'Peru', isoCode: 'pe', continent: 'South America', aspectRatio: 3 / 2, colors: ['#D91023', '#FFFFFF'] },
  { name: 'Venezuela', isoCode: 've', continent: 'South America', aspectRatio: 3 / 2, colors: ['#FFCC00', '#00247D', '#CF142B', '#FFFFFF'] },
  { name: 'Chile', isoCode: 'cl', continent: 'South America', aspectRatio: 3 / 2, colors: ['#FFFFFF', '#0039A6', '#D52B1E'] },
  { name: 'Ecuador', isoCode: 'ec', continent: 'South America', aspectRatio: 2 / 1, colors: ['#FFE800', '#00148E', '#DA0010'] },
  { name: 'Bolivia', isoCode: 'bo', continent: 'South America', aspectRatio: 22 / 15, colors: ['#D52B1E', '#F7E214', '#007934'] },
  { name: 'Paraguay', isoCode: 'py', continent: 'South America', aspectRatio: 20 / 11, colors: ['#D52B1E', '#FFFFFF', '#0038A8'] },
  { name: 'Uruguay', isoCode: 'uy', continent: 'South America', aspectRatio: 3 / 2, colors: ['#FFFFFF', '#0038A8', '#FCD116'] },

  // Oceania (15 countries)
  { name: 'Australia', isoCode: 'au', continent: 'Oceania', aspectRatio: 2 / 1, colors: ['#00008B', '#FFFFFF', '#FF0000'] },
  { name: 'New Zealand', isoCode: 'nz', continent: 'Oceania', aspectRatio: 2 / 1, colors: ['#00247D', '#FFFFFF', '#CC142B'] },
  { name: 'Papua New Guinea', isoCode: 'pg', continent: 'Oceania', aspectRatio: 4 / 3, colors: ['#000000', '#FF0000', '#FFCC00', '#FFFFFF'] },
  { name: 'Fiji', isoCode: 'fj', continent: 'Oceania', aspectRatio: 2 / 1, colors: ['#68BFE5', '#FFFFFF', '#012169', '#C8102E'] },
  { name: 'Solomon Islands', isoCode: 'sb', continent: 'Oceania', aspectRatio: 2 / 1, colors: ['#0000D6', '#006000', '#FFCC00', '#FFFFFF'] },
  { name: 'Vanuatu', isoCode: 'vu', continent: 'Oceania', aspectRatio: 5 / 3, colors: ['#009543', '#D21034', '#000000', '#FDCE12'] },
  { name: 'Samoa', isoCode: 'ws', continent: 'Oceania', aspectRatio: 2 / 1, colors: ['#CE1126', '#002B7F', '#FFFFFF'] },
  { name: 'Kiribati', isoCode: 'ki', continent: 'Oceania', aspectRatio: 2 / 1, colors: ['#E73E2D', '#FEC74A', '#FFFFFF', '#005989'] },
  { name: 'Tonga', isoCode: 'to', continent: 'Oceania', aspectRatio: 2 / 1, colors: ['#C10000', '#FFFFFF'] },
  { name: 'Micronesia', isoCode: 'fm', continent: 'Oceania', aspectRatio: 19 / 10, colors: ['#6797D6', '#FFFFFF'] },
  { name: 'Palau', isoCode: 'pw', continent: 'Oceania', aspectRatio: 8 / 5, colors: ['#4AADD6', '#FFDE00'] },
  { name: 'Marshall Islands', isoCode: 'mh', continent: 'Oceania', aspectRatio: 19 / 10, colors: ['#3B5AA3', '#FFFFFF', '#E2AE57'] },
  { name: 'Nauru', isoCode: 'nr', continent: 'Oceania', aspectRatio: 2 / 1, colors: ['#002170', '#FFB20D', '#FFFFFF'] },
  { name: 'Tuvalu', isoCode: 'tv', continent: 'Oceania', aspectRatio: 2 / 1, colors: ['#012169', '#FFFFFF', '#C8102E', '#009FCA'] },
  { name: 'East Timor', isoCode: 'tl', continent: 'Oceania', aspectRatio: 2 / 1, colors: ['#CB000F', '#F8C00C', '#000000', '#FFFFFF'] },
];

export function getCountriesByContinent(continent: Continent): Country[] {
  return countries.filter((c) => c.continent === continent);
}

export function getRandomCountry(continent?: Continent): Country {
  const pool = continent ? getCountriesByContinent(continent) : countries;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

export const continentEmojis: Record<Continent, string> = {
  Europe: '🇪🇺',
  Asia: '🌏',
  Africa: '🌍',
  'North America': '🌎',
  'South America': '🌎',
  Oceania: '🏝️',
};
