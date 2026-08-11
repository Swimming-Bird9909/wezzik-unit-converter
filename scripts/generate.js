#!/usr/bin/env node
/* eslint-disable */
'use strict';

/**
 * UnitWise — 页面批量生成器
 * 用法：
 *   node scripts/generate.js                    # 输出 60+ 长尾页 + 类别页 + 聚合页
 *   node scripts/generate.js --all              # 输出精选 + 自动生成的全量互转对
 *   node scripts/generate.js --slug kg-to-lbs   # 只输出单个页面
 *
 * 输入：templates/converter.html + assets/js/data.js
 * 输出：根目录的 {slug}.html / {category-slug}-conversion.html / all-converters.html + sitemap.xml
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TEMPLATE_PATH = path.join(ROOT, 'templates', 'converter.html');
const DATA_PATH = path.join(ROOT, 'assets', 'js', 'data.js');
const SITEMAP_PATH = path.join(ROOT, 'sitemap.xml');

const { UNIT_DATA, FEATURED_PAIRS } = require(DATA_PATH);

const argv = process.argv.slice(2);
const argMap = Object.fromEntries(
  argv.reduce((acc, cur, i) => (cur.startsWith('--') ? [...acc, [cur.slice(2), argv[i+1]]] : acc), [])
);
const onlyOneSlug = argMap.slug;
const includeAll = argv.includes('--all');

const TEMPLATE = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

// ===== 文案库 =====
// 每个类别 4-6 个 FAQ，以及两段 about 软文。直接静态写、不做 AI 拼装以保证一致性。

const COPY = {
  length: {
    aboutA: (from, to) => `Need to convert ${from.name} to ${to.name}? Whether you measure materials, dimensions for furniture, body height, or a woodworking project, this tool gives you the exact answer in real time. The math runs entirely in your browser — no submission, no waiting, no tracking.`,
    aboutB: (from, to) => `${capitalize(to.symbol)} belong to the imperial system, while ${from.symbol} belongs to the metric system. Both standards are widely used worldwide, but switching between them is rarely as intuitive as it should be. We use the internationally accepted SI/imperial factors with up to 8 significant digits of precision.`,
    formulaP: (from, to) => `To convert ${from.name} to ${to.name}, multiply the number by the exact factor. For example, 1 ${from.symbol} = ${(from.toBase / to.toBase).toPrecision(8)} ${to.symbol}. Just type any value above and we'll do the math instantly.`,
    faq: (uFrom, uTo) => [
      { q: `How many ${uFrom.symbol} are in a ${uTo.symbol}?`, a: `1 ${uFrom.symbol} = ${(uFrom.toBase / uTo.toBase).toPrecision(6)} ${uTo.symbol}.` },
      { q: `Which is bigger, a ${uFrom.symbol} or a ${uTo.symbol}?`, a: `A ${uTo.symbol} is approximately ${(uTo.toBase / uFrom.toBase).toFixed(4)} times bigger than a ${uFrom.symbol}.` },
      { q: `Is ${uFrom.name.toLowerCase()} the same as ${uTo.name.toLowerCase()}?`, a: `They measure the same kind of quantity (length), but they use different scales. ${uFrom.name} is metric; ${uTo.name} is imperial.` },
      { q: `How do I convert ${uFrom.symbol} to ${uTo.symbol} without a calculator?`, a: `Quick mental math: 1 inch ≈ 2.54 cm. Use the formula ${uTo.symbol} = ${uFrom.symbol} × ${(uFrom.toBase / uTo.toBase).toFixed(5)}. The table above shows the most common values already worked out.` },
      { q: `Why is the answer shown with so many decimals?`, a: `We give you up to 8 significant figures by default so engineering and science use cases stay precise. The easy-to-read chart rounds to useful values.` },
    ],
  },

  weight: {
    aboutA: (from, to) => `Whether you're tracking body weight for fitness, weighing a parcel for shipping, scaling a recipe, or checking ingredients on the back of a package, our ${from.name} → ${to.name} converter gives you the answer instantly. No need to reach for a calculator or your phone's built-in one.`,
    aboutB: (from, to) => `Weight conversions between metric (${from.name.includes('Kilo') || from.name.includes('Gram') ? from.name + ' — used almost everywhere' : 'metric'}) and imperial / US customary (${to.name.includes('Pound') || to.name.includes('Ounce') || to.name.includes('Stone') ? to.name + ' — used in the US and UK for body weight' : 'imperial'}) are extremely common because no country has fully switched. The good news: both systems are well-defined, so the answers are exact to many decimal places.`,
    formulaP: (from, to) => `To convert ${from.name.toLowerCase()} to ${to.name.toLowerCase()} multiply by the standard factor: 1 ${from.symbol} = ${(from.toBase / to.toBase).toPrecision(8)} ${to.symbol}. For example, 10 ${from.symbol} ≈ ${(10 * from.toBase / to.toBase).toFixed(4)} ${to.symbol}. The instant converter above does this automatically.`,
    faq: (uFrom, uTo) => [
      { q: `What's the difference between ${uFrom.symbol.toLowerCase()} and ${uTo.symbol.toLowerCase()}?`, a: `${capitalize(uFrom.symbol)} are metric units of mass (used worldwide in science and most countries); ${uTo.symbol} are imperial/U.S. customary, most commonly used for body weight in the US and UK.` },
      { q: `How many ${uFrom.symbol} in a ${uTo.symbol}?`, a: `1 ${uTo.symbol} = ${(uTo.toBase / uFrom.toBase).toPrecision(6)} ${uFrom.symbol}.` },
      { q: `Is 1 lb exactly 0.4536 kg?`, a: `It's exactly 0.45359237 kg by international agreement since 1959. We use that exact number in this converter.` },
      { q: `How do I quickly estimate without a calculator?`, a: `Memorise: 1 kg ≈ 2.205 lb. To go from lb to kg, divide by 2.205. The chart above has the common values pre-calculated.` },
      { q: `What's the difference between mass and weight?`, a: `In everyday language we use "weight" to mean mass. Technically weight is a force (depends on gravity), mass is the amount of matter. This converter treats them as the same thing — which is what every kitchen scale, body scale and shipping service does.` },
    ],
  },

  volume: {
    aboutA: (from, to) => `Volume conversions are among the most common on the internet — from kitchen recipes (cups vs milliliters), to fuel efficiency (gallons vs liters), to chemistry and pharmaceuticals. Our ${from.name} → ${to.name} converter is built for exactly those everyday uses.`,
    aboutB: (from, to) => `${capitalize(uOfSystem(from.symbol))} — both metric and US customary — use the same concept (3-D space occupied) but in different scales. The US customary system has been frozen since 1824. Importantly, a "cup" in Canada is 250 mL, but in the US it's 236.588 mL, which causes real-world mismatches in imported recipes. Our tool uses the US legal cup.`,
    formulaP: (from, to) => `The factor is fixed by international standards: 1 ${from.symbol} = ${(from.toBase / to.toBase).toPrecision(8)} ${to.symbol}. Type anything in the box above and the converted value appears instantly, accurate to 8 significant figures.`,
    faq: (uFrom, uTo) => [
      { q: `How many ${uFrom.symbol} in a ${uTo.symbol}?`, a: `1 ${uTo.symbol} = ${(uTo.toBase / uFrom.toBase).toPrecision(6)} ${uFrom.symbol}.` },
      { q: `Is 1 US gallon the same as 1 UK gallon?`, a: `No. 1 US (liquid) gallon is 3.785 L; 1 UK (imperial) gallon is 4.546 L. This converter uses the US gallon unless otherwise noted.` },
      { q: `Are your fluid ounce conversions US or UK?`, a: `Our fluid ounce is the US fluid ounce (29.5735 mL). The UK (imperial) fluid ounce is 28.4131 mL — slightly smaller.` },
      { q: `Why doesn't my metric cup match the recipe?`, a: `Recipes from US sites assume 1 cup = 236.588 mL (US legal). Recipes from many other countries assume 250 mL. If you're following a US recipe, use the values from this converter.` },
      { q: `Is 100 mL the same as 100 cc?`, a: `Almost. 1 mL = 1 cc (cubic centimeter). They're interchangeable in volume, though in medicine mL is preferred. This converter uses mL.` },
    ],
  },

  temperature: {
    aboutA: (from, to) => `Whether you're reading a US weather forecast, setting a European oven, working on a science experiment, or cooking with an imported recipe, the ${from.name} → ${to.name} converter gets it right every time.`,
    aboutB: () => `Temperature scales are defined by fixed points: 0°C = 32°F (freezing point of water), 100°C = 212°F (boiling). The formula is exact and never approximate. Type any value above and we compute it precisely.`,
    formulaP: (from, to) => temperatureFormulaExplanation(from, to),
    faq: (uFrom, uTo) => [
      { q: `How do I convert ${uFrom.symbol} to ${uTo.symbol}?`, a: temperatureFormulaAnswer(uFrom, uTo) },
      { q: `At what temperature are ${uFrom.symbol} and ${uTo.symbol} the same?`, a: crossoverTemperature(uFrom, uTo) },
      { q: `What's the boiling and freezing point in ${uTo.symbol}?`, a: `Water boils at 212 °F (100 °C), freezes at 32 °F (0 °C).` },
      { q: `Do I need to subtract 32 first or multiply first?`, a: `Always subtract 32 first when converting °F to anything else. The formula is °C = (°F − 32) × 5/9.` },
      { q: `What is absolute zero in ${uTo.symbol}?`, a: absoluteZero(uTo) },
    ],
  },

  pressure: {
    aboutA: (from, to) => `Pressure conversions matter in tire shops, hydraulics, gas systems, scuba diving, meteorology, and engineering. Our ${from.name} → ${to.name} converter gives instant exact answers using the standard international factors.`,
    aboutB: () => `Different industries live in different units: tires are measured in psi or bar, natural gas in kPa, vacuum in torr or mmHg, atm in chemistry. The good news: all units measure the exact same physical quantity, so factors between them are fixed.`,
    formulaP: (from, to) => `The factor is: 1 ${from.symbol} = ${(from.toBase / to.toBase).toPrecision(8)} ${to.symbol}. Type any value above and see the result instantly.`,
    faq: (uFrom, uTo) => [
      { q: `How many psi is 1 bar?`, a: `1 bar = 14.5038 psi (exactly).` },
      { q: `Why is psi so different from kPa?`, a: `1 psi = 6894.76 pascals. psi is older and still common in US industry; the SI standard is pascal/kPa.` },
      { q: `How do I read tire pressure units?`, a: `Most US cars list psi (e.g. 32 psi cold). European and many new cars list bar (e.g. 2.2 bar). 1 bar ≈ 14.5 psi.` },
      { q: `Is 1 atm the same as 101.325 kPa?`, a: `Yes — by definition 1 standard atmosphere = 101,325 Pa exactly.` },
    ],
  },

  speed: {
    aboutA: (from, to) => `Speedometers, flight tickets, running watches, car manuals, and shipping all use different speed units. Our ${from.name} → ${to.name} converter helps you read foreign labels and translate limits instantly.`,
    aboutB: () => `${capitalize('')} Metric (m/s, km/h) and imperial (mph, ft/s) units coexist worldwide. Nautical units (knots) dominate maritime and aviation.`,
    formulaP: (from, to) => `Multiply by the exact factor: 1 ${from.symbol} = ${(from.toBase / to.toBase).toPrecision(8)} ${to.symbol}. The tool does this in real time.`,
    faq: (uFrom, uTo) => [
      { q: `How fast is 100 mph in km/h?`, a: `100 mph = 160.934 km/h exactly.` },
      { q: `Is a knot the same as a nautical mile per hour?`, a: `Yes, 1 knot = 1 nautical mile per hour = 1.852 km/h.` },
      { q: `How fast is the speed of sound?`, a: `About 767 mph, 1235 km/h, or 343 m/s at sea level.` },
    ],
  },

  area: {
    aboutA: (from, to) => `Real estate listings, land surveys, floor plans, farming — area conversions are everywhere. Our ${from.name} → ${to.name} converter helps you compare property and project sizes.`,
    aboutB: () => `The metric system uses square meters and hectares; imperial/US uses square feet, acres, and square miles. A hectare is exactly 10,000 m² ≈ 2.471 acres.`,
    formulaP: (from, to) => `1 ${from.symbol} = ${(from.toBase / to.toBase).toPrecision(8)} ${to.symbol}. Type and the answer appears.`,
    faq: (uFrom, uTo) => [
      { q: `How big is 1 acre?`, a: `1 acre = 4,046.86 m² = 43,560 ft².` },
      { q: `Is 1 hectare bigger than 1 acre?`, a: `Yes, 1 hectare (10,000 m²) ≈ 2.471 acres.` },
      { q: `How many square feet in a square meter?`, a: `1 m² = 10.7639 ft² exactly.` },
    ],
  },

  time: {
    aboutA: (from, to) => `Time conversions are sometimes surprising — they look easy but mistakes pile up. Our ${from.name} → ${to.name} converter makes sure every unit aligns.`,
    aboutB: () => `Time is the most internationally consistent unit. The second is the same on every continent. The year and month are approximations — this converter uses 365.25 days per year and 30.4375 days per month average.`,
    formulaP: (from, to) => `1 ${from.symbol} = ${(from.toBase / to.toBase).toPrecision(8)} ${to.symbol}.`,
    faq: (uFrom, uTo) => [
      { q: `How many seconds in a day?`, a: `Exactly 86,400 (24 × 60 × 60).` },
      { q: `How many days in a year?`, a: `365 normal, 366 in a leap year. Average: 365.25 days = 31,557,600 seconds.` },
      { q: `How many weeks in a year?`, a: `52 weeks + 1 or 2 days. Average: 52.18 weeks.` },
    ],
  },

  energy: {
    aboutA: (from, to) => `Food calories, electric bills, scientific papers, nutrition labels — they all use different units. Our ${from.name} → ${to.name} converter helps you translate between them without mistakes.`,
    aboutB: () => `Calorie (cal) and Calorie (kcal, food) are 1000× different. Make sure your input is in the right scale.`,
    formulaP: (from, to) => `1 ${from.symbol} = ${(from.toBase / to.toBase).toPrecision(8)} ${to.symbol}.`,
    faq: (uFrom, uTo) => [
      { q: `Is a food calorie the same as a physics calorie?`, a: `No. 1 food Calorie (kcal) = 1000 small calories (cal).` },
      { q: `How many joules in a calorie?`, a: `1 kcal = 4,184 J exactly. 1 cal = 4.184 J.` },
      { q: `How many kWh does an average home use?`, a: `About 10,000 kWh per year in the US, much lower in Europe (≈3,000 kWh).` },
    ],
  },

  data: {
    aboutA: (from, to) => `Confused about whether a GB equals 1,000 or 1,024 MB? You're not alone — and your phone, Mac, Windows PC, and ISP can all show slightly different numbers for the same file. Our ${from.name} → ${to.name} converter uses the SI standard by default.`,
    aboutB: () => `The SI standard (1 kB = 1000 B) is used by hard-drive makers, macOS, modern Windows, all networking, and the IEC. The old binary standard (1 KiB = 1024 B) is used inside RAM and was the original "kilo" in computing.`,
    formulaP: (from, to) => `Using SI prefixes (decimal): 1 ${from.symbol} = ${(from.toBase / to.toBase).toPrecision(8)} ${to.symbol}.`,
    faq: (uFrom, uTo) => [
      { q: `Is 1 kB 1000 bytes or 1024?`, a: `By SI/IEC since 1998, 1 kB = 1000 bytes. The binary version is 1 KiB = 1024 bytes. Most modern systems use kB for 1000.` },
      { q: `Why does my 500 GB SSD show 465 GB?`, a: `Because storage is sold in SI (500 × 1000 × 1000 × 1000 = 500 GB) but reported in binary by some tools (500 / 1.024^3 ≈ 465 GiB). Same drive, different counting.` },
      { q: `How many MB in a GB?`, a: `1,000 MB (SI) or 1,024 MB (binary). This converter uses 1,000 by default.` },
    ],
  },

  angle: {
    aboutA: (from, to) => `Engineers, scientists, and students often switch between degrees and radians. Our ${from.name} → ${to.name} converter handles it instantly.`,
    aboutB: () => `A full circle is 360 degrees = 2π radians. The conversion factor is exactly 180/π. We use the standard mathematical constant π = 3.14159265358979.`,
    formulaP: (from, to) => `1 ${from.symbol} = ${(from.toBase / to.toBase).toPrecision(8)} ${to.symbol}. The formula: ${angleFormula(from.key, to.key)}.`,
    faq: (uFrom, uTo) => [
      { q: `Why do mathematicians use radians?`, a: `Because sin(x) ≈ x is only true in radians. It's the "natural" unit for circles.` },
      { q: `How many degrees in π radians?`, a: `Exactly 180. 2π rad = 360°.` },
    ],
  },

  frequency: {
    aboutA: (from, to) => `${from.name} to ${to.name} is commonly needed for CPU clock speeds, radio frequencies, audio engineering, and physics.`,
    aboutB: () => `Hertz = cycles per second. Common multiples: kHz (audio), MHz (radio), GHz (CPU).`,
    formulaP: (from, to) => `1 ${from.symbol} = ${(from.toBase / to.toBase).toPrecision(8)} ${to.symbol}.`,
    faq: (uFrom, uTo) => [
      { q: `How many Hz in a GHz?`, a: `1 GHz = 1,000,000,000 Hz = 10⁹ Hz.` },
      { q: `What's MHz mean?`, a: `Megahertz = 1,000,000 cycles per second. Used for FM radio (~100 MHz), old CPUs (~1000 MHz).` },
    ],
  },

  fuelEconomy: {
    aboutA: (from, to) => `MPG (US), MPG (UK), L/100km, km/L — different countries and industries use different units. Our ${from.name} → ${to.name} converter helps you compare fuel economy.`,
    aboutB: () => `The US measures in miles per gallon; most of Europe uses liters per 100 km (lower is better). Japan and many developing markets use km per liter (higher is better).`,
    formulaP: (from, to) => `Our converter uses 1 US gallon = 3.785 L and 1 UK gallon = 4.546 L.`,
    faq: (uFrom, uTo) => [
      { q: `How do I convert MPG (US) to L/100km?`, a: `L/100km = 235.215 ÷ MPG(US).` },
      { q: `What's a good MPG?`, a: `30+ MPG (US) or 5 L/100km is generally considered efficient for a regular car.` },
    ],
  },
};

// ===== Helpers =====
function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
function uOfSystem(sym) { return sym.toLowerCase().includes('l') || sym === 'kg' || sym === 'g' ? 'metric' : 'imperial/us'; }

// 跨类别查找单位
function findUnitAny(cat, key, cross) {
  if (UNIT_DATA[cat]?.units?.[key]) return { key, cat, ...UNIT_DATA[cat].units[key] };
  if (cross && UNIT_DATA[cross]?.units?.[key]) return { key, cat: cross, ...UNIT_DATA[cross].units[key] };
  for (const c of Object.keys(UNIT_DATA)) {
    if (UNIT_DATA[c]?.units?.[key]) return { key, cat: c, ...UNIT_DATA[c].units[key] };
  }
  return null;
}
function temperatureFormulaExplanation(from, to) {
  if (from.key === 'celsius' && to.key === 'fahrenheit') return `Use the formula °F = (°C × 9/5) + 32. Example: 100 °C = 212 °F. The tool applies this automatically.`;
  if (from.key === 'fahrenheit' && to.key === 'celsius') return `Use °C = (°F − 32) × 5/9. Example: 32 °F = 0 °C. The tool applies this formula in real time.`;
  if (from.key === 'celsius' && to.key === 'kelvin') return `K = °C + 273.15. Example: 0 °C = 273.15 K.`;
  if (from.key === 'kelvin'     && to.key === 'celsius') return `°C = K − 273.15. Example: 0 K = −273.15 °C (absolute zero).`;
  return `Use the standard temperature formula for your input unit.`;
}
function temperatureFormulaAnswer(uFrom, uTo) {
  if (uFrom.key === 'celsius' && uTo.key === 'fahrenheit') return `Multiply by 9/5, then add 32: F = C × 1.8 + 32.`;
  if (uFrom.key === 'fahrenheit' && uTo.key === 'celsius') return `Subtract 32, then multiply by 5/9: C = (F − 32) × 0.5556.`;
  if (uFrom.key === 'celsius' && uTo.key === 'kelvin') return `Add 273.15: K = C + 273.15.`;
  if (uFrom.key === 'kelvin' && uTo.key === 'celsius') return `Subtract 273.15: C = K − 273.15.`;
  return 'Use the standard temperature conversion formula.';
}
function crossoverTemperature(uFrom, uTo) {
  // only well-known pair is C and F
  if ((uFrom.key === 'celsius' && uTo.key === 'fahrenheit') || (uFrom.key === 'fahrenheit' && uTo.key === 'celsius')) {
    return `−40 degrees. −40 °C = −40 °F exactly.`;
  }
  return 'These scales never produce the same numerical value because their zero points differ.';
}
function absoluteZero(uTo) {
  if (uTo.key === 'celsius') return `−273.15 °C.`;
  if (uTo.key === 'fahrenheit') return `−459.67 °F.`;
  if (uTo.key === 'kelvin') return `0 K (defined as exactly this).`;
  return `0 K, equivalent to −273.15 °C.`;
}
function angleFormula(fromKey, toKey) {
  if (fromKey === 'degree' && toKey === 'radian') return 'radians = degrees × π / 180';
  if (fromKey === 'radian' && toKey === 'degree') return 'degrees = radians × 180 / π';
  return 'use the fixed factor in the table';
}
function shorten(n, sig = 6) {
  const s = String(n);
  if (s.length <= 14) return s;
  return Number(n).toExponential(sig - 1);
}
function escapeForJson(str) {
  return JSON.stringify(str).slice(1, -1);
}
// 用于 HTML 属性值的转义：把 " 转成 &quot;，让属性值合法
function escapeForHtmlAttr(str) {
  return String(str).replace(/"/g, '&quot;');
}

// ===== Generate one page =====
function renderOne(pair) {
  const catData = UNIT_DATA[pair.cat];
  const uFrom = findUnitAny(pair.cat, pair.from, pair.cross);
  const uTo   = findUnitAny(pair.cat, pair.to,   pair.cross);
  if (!catData || !uFrom || !uTo) {
    console.error(`⚠️  Skipping ${pair.slug}: unit lookup failed (from=${pair.from}, to=${pair.to})`);
    return;
  }
  const isCross = !!pair.density;
  const copy = COPY[uFrom.cat] || COPY[uTo.cat] || COPY.weight;

  const title = `${uFrom.name} to ${uTo.name} Converter`;
  const h1   = `${uFrom.name} to ${uTo.name} Converter`;
  const h1LowerCase = `${uFrom.name} to ${uTo.name}`.toLowerCase();
  const metaDescription = copy.aboutA(uFrom, uTo).slice(0, 158).replace(/<[^>]+>/g, '');
  const keywords = [uFrom.name.toLowerCase(), uTo.name.toLowerCase(), uFrom.symbol, uTo.symbol, pair.slug, 'converter', 'free'].join(', ');
  const longDesc = copy.aboutA(uFrom, uTo);

  // cross-cat（density-based）专用：覆盖通用 copy
  let formulaPara, about1, about2;
  if (pair.density) {
    formulaPara = `To convert ${uFrom.name.toLowerCase()} to ${uTo.name.toLowerCase()} for ${pair.material}, divide by ${pair.density}. For example, 100 ${uFrom.symbol} ≈ ${(100 / pair.density).toFixed(3)} ${uTo.symbol}. The instant converter above does this automatically using the density for ${pair.material}. (Density may vary by brand — adjust if your ingredients differ.)`;
    about1 = `${uFrom.name === 'Gram' ? 'Grams' : uFrom.name} to ${uTo.name.toLowerCase()} conversions depend on the density of the ingredient. This converter is calibrated for ${pair.material}; for other ingredients (e.g. flour, sugar, honey) the ratio differs.`;
    about2 = `Volume-to-mass ratios like ${pair.density} ${uFrom.symbol.toLowerCase()} per ${uTo.symbol.toLowerCase()} are reference values widely used in cookbooks. They assume standard density at room temperature.`;
  } else {
    formulaPara = copy.formulaP(uFrom, uTo);
    about1 = copy.aboutA(uFrom, uTo);
    about2 = copy.aboutB(uFrom, uTo);
  }

  const formulaText = (function () {
    if (pair.cat === 'temperature') {
      if (pair.from === 'celsius' && pair.to === 'fahrenheit') return '°F = (°C × 9/5) + 32';
      if (pair.from === 'fahrenheit' && pair.to === 'celsius') return '°C = (°F − 32) × 5/9';
      if (pair.from === 'celsius' && pair.to === 'kelvin')     return 'K = °C + 273.15';
      if (pair.from === 'kelvin' && pair.to === 'celsius')     return '°C = K − 273.15';
      if (pair.from === 'fahrenheit' && pair.to === 'kelvin')  return 'K = (°F − 32) × 5/9 + 273.15';
      if (pair.from === 'kelvin' && pair.to === 'fahrenheit')  return '°F = (K − 273.15) × 9/5 + 32';
      if (pair.from === 'rankine' && pair.to === 'celsius')    return '°C = °R × 5/9 − 273.15';
      if (pair.from === 'celsius' && pair.to === 'rankine')    return '°R = (°C + 273.15) × 9/5';
      return `${uTo.symbol} = f(${uFrom.symbol})`;
    }
    if (pair.density) {
      return `1 ${uTo.symbol} ≈ ${pair.density} ${uFrom.symbol}   (${pair.material || 'ingredient-dependent'})`;
    }
    const factor = uFrom.toBase / uTo.toBase;
    return `1 ${uFrom.symbol} = ${shorten(factor)} ${uTo.symbol}`;
  })();

  // Related（同类别内其他换算对）8 张卡
  const sameCatOthers = FEATURED_PAIRS.filter(p => p.cat === pair.cat && p.slug !== pair.slug).slice(0, 8);
  const relatedCards = sameCatOthers.map(p => {
    const uf = findUnitAny(p.cat, p.from, p.cross);
    const ut = findUnitAny(p.cat, p.to,   p.cross);
    if (!uf || !ut) return '';
    return `<a class="uw-card" href="/${p.slug}.html">
      <div class="uw-card__icon">${CATEGORY_ICONS[p.cat] || '🔄'}</div>
      <h3>${escapeForJson(uf.name)} to ${escapeForJson(ut.name)}</h3>
      <p>Quick conversion from ${escapeForJson(uf.name.toLowerCase())} to ${escapeForJson(ut.name.toLowerCase())}.</p>
    </a>`;
  }).filter(Boolean).join('\n');
  const relatedCardsFill = sameCatOthers.length
    ? relatedCards
    : `<p>More related converters coming soon. Bookmark this page and check back!</p>`;

  const faqItems = copy.faq(uFrom, uTo).map(({ q, a }) => `
    <details class="uw-faq__item">
      <summary class="uw-faq__q">${q}</summary>
      <p class="uw-faq__a">${a}</p>
    </details>`).join('');

  // JSON-LD
  const jsonLdWebApp = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title,
    url: `https://convert.wezzik.com/${pair.slug}.html`,
    description: metaDescription,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }, null, 2);

  const jsonLdBreadcrumb = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://convert.wezzik.com/' },
      { '@type': 'ListItem', position: 2, name: catData.name, item: `https://convert.wezzik.com/${pair.cat}-conversion.html` },
      { '@type': 'ListItem', position: 3, name: `${uFrom.name} to ${uTo.name}` },
    ],
  }, null, 2);

  const faqLd = copy.faq(uFrom, uTo).map(({ q, a }) => ({
    '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a },
  }));
  const jsonLdFaq = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqLd,
  }, null, 2);

  // 找反向配对（允许跨类别，对应 cooking 对）
  const reverse = FEATURED_PAIRS.find(p => {
    if (p.from !== pair.to || p.to !== pair.from) return false;
    // 同 cat 直接命中；跨类别也要算同 pair
    return p.cat === pair.cat || p.cross === pair.cat || p.cat === pair.cross;
  });
  // 跨类别安全的单位查找
  function unitOf(p, key) {
    if (UNIT_DATA[p.cat]?.units?.[key]) return UNIT_DATA[p.cat].units[key];
    if (p.cross && UNIT_DATA[p.cross]?.units?.[key]) return UNIT_DATA[p.cross].units[key];
    for (const c of Object.keys(UNIT_DATA)) {
      if (UNIT_DATA[c]?.units?.[key]) return UNIT_DATA[c].units[key];
    }
    return { name: key, symbol: key }; // 退化 fallback
  }
  const toToFromBreadcrumb = reverse
    ? `${unitOf(reverse, reverse.from).name} to ${unitOf(reverse, reverse.to).name}`
    : `${uTo.name} to ${uFrom.name}`;

  // 用模板替换占位符
  const out = TEMPLATE
    .replace(/{TITLE}/g,                escapeForJson(title))
    .replace(/{META_DESCRIPTION}/g,     escapeForJson(metaDescription))
    .replace(/{KEYWORDS}/g,             escapeForJson(keywords))
    .replace(/{SLUG}/g,                 pair.slug)
    .replace(/{CATEGORY_SLUG}/g,        catData.slug || pair.cat)
    .replace(/{CATEGORY_NAME}/g,        catData.name)
    .replace(/{H1}/g,                   escapeForJson(h1))
    .replace(/{H1_BREADCRUMB}/g,        escapeForJson(`${uFrom.name} to ${uTo.name}`))
    .replace(/{LONG_DESCRIPTION}/g,     escapeForJson(longDesc))
    .replace(/{FROM_UNIT_NAME}/g,       uFrom.name)
    .replace(/{FROM_UNIT_NAME_LOWER}/g, uFrom.name.toLowerCase())
    .replace(/{TO_UNIT_NAME}/g,         uTo.name)
    .replace(/{TO_UNIT_NAME_LOWER}/g,   uTo.name.toLowerCase())
    .replace(/{FROM_UNIT_SYMBOL}/g,     uFrom.symbol)
    .replace(/{TO_UNIT_SYMBOL}/g,       uTo.symbol)
    .replace(/{TO_TO_FROM_BREADCRUMB}/g, toToFromBreadcrumb)
    .replace(/{PAIR_DATA}/g,            escapeForHtmlAttr(JSON.stringify(pair)))
    .replace(/{FORMULA_PARAGRAPH}/g,    escapeForJson(formulaPara))
    .replace(/{ABOUT_PARAGRAPH_1}/g,    escapeForJson(about1))
    .replace(/{ABOUT_PARAGRAPH_2}/g,    escapeForJson(about2))
    .replace(/{FORMULA}/g,              escapeForJson(formulaText))
    .replace(/{RELATED_CARDS}/g,        relatedCardsFill)
    .replace(/{FAQ_ITEMS}/g,            faqItems)
    .replace(/{JSON_LD_WEBAPP}/g,       jsonLdWebApp)
    .replace(/{JSON_LD_BREADCRUMB}/g,   jsonLdBreadcrumb)
    .replace(/{JSON_LD_FAQ}/g,          jsonLdFaq);

  fs.writeFileSync(path.join(ROOT, `${pair.slug}.html`), out, 'utf-8');
}

const CATEGORY_ICONS = {
  length: '📏', weight: '⚖️', volume: '🧴', temperature: '🌡️',
  pressure: '🔧', speed: '💨', area: '📐', time: '⏱️',
  energy: '⚡', 'data-storage': '💾', angle: '📊', frequency: '📡',
  'fuel-economy': '⛽',
};

// ===== Generate category pages (聚合页) =====
function renderCategoryPage(catKey) {
  const catData = UNIT_DATA[catKey];
  if (!catData) return;
  const slug = catData.slug || catKey;
  const allPairsInCat = FEATURED_PAIRS.filter(p => p.cat === catKey);

  const cards = allPairsInCat.map(p => {
    const uf = findUnitAny(p.cat, p.from, p.cross);
    const ut = findUnitAny(p.cat, p.to,   p.cross);
    if (!uf || !ut) return '';
    return `<a class="uw-card" href="/${p.slug}.html">
      <div class="uw-card__icon">${CATEGORY_ICONS[catKey] || '🔄'}</div>
      <h3>${escapeForJson(uf.name)} to ${escapeForJson(ut.name)}</h3>
      <p>Quick conversion from ${escapeForJson(uf.name.toLowerCase())} to ${escapeForJson(ut.name.toLowerCase())}.</p>
    </a>`;
  }).filter(Boolean).join('\n');

  const title = `${catData.name} Converter — All Conversions | UnitWise`;
  const metaDesc = `Free ${catData.name.toLowerCase()} converter. ${allPairsInCat.length}+ tools covering every major unit. ${catData.description}`;

  const html = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeForJson(title)}</title>
  <meta name="description" content="${escapeForJson(metaDesc)}" />
  <link rel="canonical" href="https://convert.wezzik.com/${slug}-conversion.html" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <meta property="og:title" content="${escapeForJson(title)}" />
  <meta property="og:description" content="${escapeForJson(metaDesc)}" />
  <meta property="og:image" content="https://convert.wezzik.com/assets/img/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="https://convert.wezzik.com/assets/img/og-image.png" />
  <meta name="theme-color" content="#4f46e5" />
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="/assets/css/style.css" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
</head>
<body>
  <header class="uw-header">
    <div class="uw-container uw-header__inner">
      <a href="/" class="uw-logo"><span class="uw-logo__mark">U</span> UnitWise</a>
      <nav class="uw-nav">
        <a href="/all-converters.html">All Converters</a>
        <a href="/about.html">About</a>
        <a href="/contact.html">Contact</a>
        <button data-toggle-theme class="uw-theme-toggle">◑</button>
      </nav>
    </div>
  </header>
  <main>
    <div class="uw-container">
      <nav class="uw-breadcrumb"><a href="/">Home</a><span class="uw-breadcrumb__sep">›</span><a href="/all-converters.html">All Converters</a><span class="uw-breadcrumb__sep">›</span><span>${escapeForJson(catData.name)}</span></nav>
      <h1>${escapeForJson(catData.name)} Converter</h1>
      <p style="max-width: 720px;">${escapeForJson(catData.description)}</p>

      <section class="uw-section" style="padding-top: 2rem;">
        <div class="uw-grid">
          ${cards}
        </div>
      </section>

      <section class="uw-section uw-prose">
        <h2>About ${escapeForJson(catData.name.toLowerCase())} conversion</h2>
        <p>${escapeForJson(catData.description)}</p>
        <p>Every conversion on this page uses the internationally accepted standard. Our converters display results to 8 significant figures by default and round common values for quick reference in the embedded chart.</p>
      </section>
    </div>
  </main>
  <footer class="uw-footer">
    <div class="uw-container uw-footer__bottom">
      <span>© <span data-year>2026</span> UnitWise. All rights reserved.</span>
      <span><a href="/">Home</a> · <a href="/legal/privacy.html">Privacy</a> · <a href="/legal/terms.html">Terms</a></span>
    </div>
  </footer>
  <script src="/assets/js/data.js"></script>
  <script src="/assets/js/main.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(ROOT, `${slug}-conversion.html`), html, 'utf-8');
}

// ===== all-converters.html =====
function renderAllConverters() {
  const cats = Object.keys(UNIT_DATA).filter(k => k !== 'data'); // data 已经分开
  const cards = cats.map(catKey => {
    const cat = UNIT_DATA[catKey];
    return `<a class="uw-card" href="/${cat.slug}-conversion.html">
      <div class="uw-card__icon">${CATEGORY_ICONS[catKey] || '🔄'}</div>
      <h3>${escapeForJson(cat.name)}</h3>
      <p>${escapeForJson(cat.description.slice(0, 100))}...</p>
    </a>`;
  }).join('\n');

  // 烹饪是一个跨类别的聚合页（非 UNIT_DATA 键），单独补一张卡片
  const cookingCard = `<a class="uw-card" href="/cooking-conversion.html">
      <div class="uw-card__icon">🍳</div>
      <h3>Cooking</h3>
      <p>Cups, grams, tablespoons, ounces — for the kitchen.</p>
    </a>`;

  const html = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>All Unit Converters — Browse Every Tool | UnitWise</title>
  <meta name="description" content="Browse every unit converter we offer: length, weight, temperature, volume, pressure, cooking and more. Find the exact one you need." />
  <link rel="canonical" href="https://convert.wezzik.com/all-converters.html" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <meta property="og:title" content="All Unit Converters — Browse Every Tool | UnitWise" />
  <meta property="og:description" content="Browse every unit converter we offer: length, weight, temperature, volume, pressure, cooking and more. Find the exact one you need." />
  <meta property="og:image" content="https://convert.wezzik.com/assets/img/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="https://convert.wezzik.com/assets/img/og-image.png" />
  <meta name="theme-color" content="#4f46e5" />
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="/assets/css/style.css" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
</head>
<body>
  <header class="uw-header">
    <div class="uw-container uw-header__inner">
      <a href="/" class="uw-logo"><span class="uw-logo__mark">U</span> UnitWise</a>
      <nav class="uw-nav">
        <a href="/all-converters.html">All Converters</a>
        <a href="/about.html">About</a>
        <a href="/contact.html">Contact</a>
        <button data-toggle-theme class="uw-theme-toggle">◑</button>
      </nav>
    </div>
  </header>
  <main>
    <div class="uw-container">
      <nav class="uw-breadcrumb"><a href="/">Home</a><span class="uw-breadcrumb__sep">›</span><span>All Converters</span></nav>
      <h1>All unit converters</h1>
      <p style="max-width: 720px;">${FEATURED_PAIRS.length}+ converters across ${cats.length} categories. New tools added every week.</p>

      <div class="uw-search-box" style="max-width: 640px; margin: 2rem 0;">
        <input type="text" class="uw-search-input" data-instant-search placeholder="Search a converter (e.g. 'grams to cups')" />
        <ul class="uw-search-results" data-instant-results></ul>
      </div>

      <section class="uw-section" style="padding-top: 1.5rem;">
        <div class="uw-grid">
          ${cards}
          ${cookingCard}
        </div>
      </section>
    </div>
  </main>
  <footer class="uw-footer">
    <div class="uw-container uw-footer__bottom">
      <span>© <span data-year>2026</span> UnitWise.</span>
      <span><a href="/">Home</a> · <a href="/legal/privacy.html">Privacy</a> · <a href="/legal/terms.html">Terms</a></span>
    </div>
  </footer>
  <script src="/assets/js/data.js"></script>
  <script src="/assets/js/main.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(ROOT, 'all-converters.html'), html, 'utf-8');
}

// ===== sitemap.xml =====
function renderSitemap() {
  const urls = [
    { loc: 'https://convert.wezzik.com/', priority: '1.0' },
    { loc: 'https://convert.wezzik.com/all-converters.html', priority: '0.8' },
    { loc: 'https://convert.wezzik.com/cooking-conversion.html', priority: '0.7' },
    { loc: 'https://convert.wezzik.com/blog.html', priority: '0.6' },
    ...Object.keys(UNIT_DATA).map(cat => ({ loc: `https://convert.wezzik.com/${(UNIT_DATA[cat].slug || cat)}-conversion.html`, priority: '0.7' })),
    ...FEATURED_PAIRS.map(p => ({ loc: `https://convert.wezzik.com/${p.slug}.html`, priority: '0.6' })),
    { loc: 'https://convert.wezzik.com/about.html', priority: '0.5' },
    { loc: 'https://convert.wezzik.com/contact.html', priority: '0.5' },
    { loc: 'https://convert.wezzik.com/legal/privacy.html', priority: '0.3' },
    { loc: 'https://convert.wezzik.com/legal/terms.html', priority: '0.3' },
    { loc: 'https://convert.wezzik.com/legal/cookies.html', priority: '0.3' },
  ];
  const lastmod = new Date().toISOString();
  const body = urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
  fs.writeFileSync(SITEMAP_PATH, xml, 'utf-8');
}

// ===== Main =====
function main() {
  if (onlyOneSlug) {
    const pair = FEATURED_PAIRS.find(p => p.slug === onlyOneSlug);
    if (!pair) { console.error(`Slug "${onlyOneSlug}" not found in FEATURED_PAIRS.`); process.exit(1); }
    console.log(`→ Rendering single page: ${pair.slug}`);
    renderOne(pair);
    return;
  }

  console.log(`→ Rendering ${FEATURED_PAIRS.length} long-tail converter pages...`);
  FEATURED_PAIRS.forEach(p => renderOne(p));

  console.log(`→ Rendering category landing pages...`);
  Object.keys(UNIT_DATA).forEach(catKey => renderCategoryPage(catKey));

  console.log(`→ Rendering all-converters aggregator...`);
  renderAllConverters();

  console.log(`→ Rendering sitemap.xml...`);
  renderSitemap();

  console.log(`\nDone. Generated ${FEATURED_PAIRS.length} long-tail pages + ${Object.keys(UNIT_DATA).length} category pages + sitemap.`);
  console.log(`\nNext steps:`);
  console.log(`  1. preview locally:   open index.html in your browser`);
  console.log(`  2. deploy to Cloudflare Pages:  cf pages deploy .`);
  console.log(`  3. submit sitemap:    curl "https://www.google.com/ping?sitemap=https://convert.wezzik.com/sitemap.xml"`);
}

main();
