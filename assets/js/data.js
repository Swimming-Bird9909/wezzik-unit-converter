/**
 * UnitWise — 单位定义与换算因子（核心数据层）
 * 同时支持浏览器（直接引入 <script src>）和 Node（`require()`）。
 */
(function (root) {
  'use strict';

  // ===== 基础 =====
  const UNIT_DATA = {
    length: {
      name: 'Length',
      slug: 'length',
      metaName: 'Length Converter',
      description:
        'Convert between metric and imperial units of length — millimeters, centimeters, meters, kilometers, inches, feet, yards, miles and nautical miles. Fast and accurate.',
      units: {
        millimeter: { name: 'Millimeter',  symbol: 'mm',  aliases: ['millimeters', 'millimetre', 'millimetres'], toBase: 0.001 },
        centimeter: { name: 'Centimeter',  symbol: 'cm',  aliases: ['centimeters', 'centimetre', 'centimetres'], toBase: 0.01 },
        meter:      { name: 'Meter',       symbol: 'm',   aliases: ['meters', 'metre', 'metres'], toBase: 1 },
        kilometer:  { name: 'Kilometer',   symbol: 'km',  aliases: ['kilometers', 'kilometre', 'kilometres'], toBase: 1000 },
        inch:       { name: 'Inch',        symbol: 'in',  aliases: ['inches'], toBase: 0.0254 },
        foot:       { name: 'Foot',        symbol: 'ft',  aliases: ['feet'], toBase: 0.3048 },
        yard:       { name: 'Yard',        symbol: 'yd',  aliases: ['yards'], toBase: 0.9144 },
        mile:       { name: 'Mile',        symbol: 'mi',  aliases: ['miles'], toBase: 1609.344 },
        nauticalMile:{ name: 'Nautical Mile', symbol: 'nmi', aliases: ['nautical miles', 'nm'], toBase: 1852 },
      },
    },

    weight: {
      name: 'Weight / Mass',
      slug: 'weight',
      metaName: 'Weight Converter',
      description:
        'Convert between metric and imperial units of weight — kilograms, grams, milligrams, pounds, ounces, stones and tons.',
      units: {
        milligram: { name: 'Milligram', symbol: 'mg', aliases: ['milligrams'], toBase: 0.000001 },
        gram:      { name: 'Gram',      symbol: 'g',  aliases: ['grams'], toBase: 0.001 },
        kilogram:  { name: 'Kilogram',  symbol: 'kg', aliases: ['kilograms', 'kilo'], toBase: 1 },
        metricTon: { name: 'Metric Ton',symbol: 't',  aliases: ['tonnes', 'tonne'], toBase: 1000 },
        pound:     { name: 'Pound',     symbol: 'lb', aliases: ['pounds', 'lbs'], toBase: 0.45359237 },
        ounce:     { name: 'Ounce',     symbol: 'oz', aliases: ['ounces'], toBase: 0.028349523125 },
        stone:     { name: 'Stone',     symbol: 'st', aliases: ['stones'], toBase: 6.35029318 },
        usTon:     { name: 'US Ton',    symbol: 'ton (US)', aliases: ['short ton', 'short tons', 'tons'], toBase: 907.18474 },
      },
    },

    volume: {
      name: 'Volume',
      slug: 'volume',
      metaName: 'Volume Converter',
      description:
        'Convert between metric and US/UK customary units of volume — liters, milliliters, gallons, quarts, pints, cups, fluid ounces, tablespoons and teaspoons.',
      // US customary, 国标 cup=236.588ml (US legal 240ml)
      units: {
        milliliter:    { name: 'Milliliter',   symbol: 'mL',  aliases: ['milliliters', 'ml'], toBase: 0.001 },
        liter:         { name: 'Liter',        symbol: 'L',   aliases: ['liters', 'litres', 'litre'], toBase: 1 },
        cubicMeter:    { name: 'Cubic Meter',  symbol: 'm³',  aliases: ['cubic meters', 'm3'], toBase: 1000 },
        teaspoon:      { name: 'Teaspoon',     symbol: 'tsp', aliases: ['teaspoons'], toBase: 0.00492892 },
        tablespoon:    { name: 'Tablespoon',   symbol: 'tbsp', aliases: ['tablespoons', 'tbs'], toBase: 0.0147868 },
        fluidOunceUS:  { name: 'Fluid Ounce (US)', symbol: 'fl oz', aliases: ['fluid ounces', 'oz'], toBase: 0.0295735 },
        cupUS:         { name: 'Cup (US)',     symbol: 'cup', aliases: ['cups'], toBase: 0.236588 },
        pintUS:        { name: 'Pint (US)',    symbol: 'pt',  aliases: ['pints'], toBase: 0.473176 },
        quartUS:       { name: 'Quart (US)',   symbol: 'qt',  aliases: ['quarts'], toBase: 0.946353 },
        gallonUS:      { name: 'Gallon (US)',  symbol: 'gal', aliases: ['gallons'], toBase: 3.78541 },
        cubicInch:     { name: 'Cubic Inch',   symbol: 'in³', aliases: ['cubic inches'], toBase: 1.63871e-5 },
        cubicFoot:     { name: 'Cubic Foot',   symbol: 'ft³', aliases: ['cubic feet'], toBase: 28.3168 },
      },
    },

    temperature: {
      name: 'Temperature',
      slug: 'temperature',
      metaName: 'Temperature Converter',
      description:
        'Convert between Celsius, Fahrenheit, Kelvin and Rankine. Includes formulas and a quick reference chart.',
      special: true,
      units: {
        celsius:    { name: 'Celsius',    symbol: '°C', aliases: ['celsius', 'centigrade'] },
        fahrenheit: { name: 'Fahrenheit', symbol: '°F', aliases: ['fahrenheit'] },
        kelvin:     { name: 'Kelvin',     symbol: 'K',  aliases: ['kelvin'] },
        rankine:    { name: 'Rankine',    symbol: '°R', aliases: ['rankine'] },
      },
    },

    area: {
      name: 'Area',
      slug: 'area',
      metaName: 'Area Converter',
      description:
        'Convert between metric and imperial units of area — square meters, square feet, acres, hectares and more.',
      units: {
        squareMillimeter: { name: 'Square Millimeter', symbol: 'mm²', toBase: 1e-6 },
        squareCentimeter: { name: 'Square Centimeter', symbol: 'cm²', toBase: 1e-4 },
        squareMeter:      { name: 'Square Meter',      symbol: 'm²',  toBase: 1 },
        squareKilometer:  { name: 'Square Kilometer',  symbol: 'km²', toBase: 1e6 },
        squareInch:       { name: 'Square Inch',       symbol: 'in²', toBase: 0.00064516 },
        squareFoot:       { name: 'Square Foot',       symbol: 'ft²', toBase: 0.092903 },
        squareYard:       { name: 'Square Yard',       symbol: 'yd²', toBase: 0.836127 },
        acre:             { name: 'Acre',              symbol: 'ac',  toBase: 4046.86 },
        hectare:          { name: 'Hectare',           symbol: 'ha',  toBase: 10000 },
        squareMile:       { name: 'Square Mile',       symbol: 'mi²', toBase: 2589988 },
      },
    },

    pressure: {
      name: 'Pressure',
      slug: 'pressure',
      metaName: 'Pressure Converter',
      description:
        'Convert between pascals, kilopascals, bars, psi, atmospheres, torrs and millimeters of mercury.',
      units: {
        pascal:     { name: 'Pascal',     symbol: 'Pa',   aliases: ['pascals'], toBase: 1 },
        kilopascal: { name: 'Kilopascal', symbol: 'kPa',  aliases: ['kilopascals'], toBase: 1000 },
        bar:        { name: 'Bar',        symbol: 'bar',  aliases: ['bars'], toBase: 100000 },
        psi:        { name: 'PSI',        symbol: 'psi',  aliases: ['lb/in²', 'pounds per square inch'], toBase: 6894.76 },
        atmosphere: { name: 'Atmosphere', symbol: 'atm',  aliases: ['atmospheres'], toBase: 101325 },
        torr:       { name: 'Torr',       symbol: 'Torr', aliases: ['torrs', 'mmHg'], toBase: 133.322 },
        megapascal: { name: 'Megapascal', symbol: 'MPa',  aliases: ['megapascals'], toBase: 1e6 },
      },
    },

    speed: {
      name: 'Speed',
      slug: 'speed',
      metaName: 'Speed Converter',
      description:
        'Convert between meters per second, kilometers per hour, miles per hour, knots and feet per second.',
      units: {
        meterPerSecond: { name: 'Meter / second', symbol: 'm/s', toBase: 1 },
        kilometerPerHour:{ name: 'Kilometer / hour', symbol: 'km/h', aliases: ['kmh', 'kph'], toBase: 0.277777778 },
        milePerHour:    { name: 'Mile / hour',    symbol: 'mph', aliases: ['mph', 'miles per hour'], toBase: 0.44704 },
        knot:           { name: 'Knot',           symbol: 'kn',  aliases: ['knots', 'nautical miles per hour'], toBase: 0.514444 },
        footPerSecond:  { name: 'Foot / second',  symbol: 'ft/s', aliases: ['feet per second', 'fps'], toBase: 0.3048 },
      },
    },

    time: {
      name: 'Time',
      slug: 'time',
      metaName: 'Time Converter',
      description:
        'Convert between seconds, minutes, hours, days, weeks, months and years.',
      units: {
        millisecond: { name: 'Millisecond', symbol: 'ms', toBase: 0.001 },
        second:      { name: 'Second',      symbol: 's',  toBase: 1 },
        minute:      { name: 'Minute',      symbol: 'min', aliases: ['minutes'], toBase: 60 },
        hour:        { name: 'Hour',        symbol: 'h',  aliases: ['hours'], toBase: 3600 },
        day:         { name: 'Day',         symbol: 'd',  aliases: ['days'], toBase: 86400 },
        week:        { name: 'Week',        symbol: 'wk', aliases: ['weeks'], toBase: 604800 },
        month:       { name: 'Month',       symbol: 'mo', aliases: ['months'], toBase: 2629800 },     // 平均月
        year:        { name: 'Year',        symbol: 'yr', aliases: ['years', 'y'], toBase: 31557600 },  // 儒略年
      },
    },

    energy: {
      name: 'Energy',
      slug: 'energy',
      metaName: 'Energy Converter',
      description:
        'Convert between joules, kilojoules, calories, kilocalories, watt-hours, kilowatt-hours, BTU and electronvolts.',
      units: {
        joule:      { name: 'Joule',      symbol: 'J',  aliases: ['joules'], toBase: 1 },
        kilojoule:  { name: 'Kilojoule',  symbol: 'kJ', aliases: ['kilojoules'], toBase: 1000 },
        calorie:    { name: 'Calorie',    symbol: 'cal',aliases: ['calories'], toBase: 4.184 },
        kilocalorie:{ name: 'Kilocalorie',symbol: 'kcal',aliases: ['kilocalories'], toBase: 4184 },
        wattHour:   { name: 'Watt-hour',  symbol: 'Wh', aliases: ['watt hours'], toBase: 3600 },
        kilowattHour:{ name: 'Kilowatt-hour', symbol: 'kWh', aliases: ['kilowatt hours'], toBase: 3.6e6 },
        btu:        { name: 'BTU',        symbol: 'BTU',aliases: ['btu'], toBase: 1055.06 },
        electronVolt:{ name: 'Electronvolt', symbol: 'eV', aliases: ['electronvolts'], toBase: 1.602176634e-19 },
      },
    },

    data: {
      name: 'Digital Storage',
      slug: 'data-storage',
      metaName: 'Data Storage Converter',
      description:
        'Convert between bits, bytes, kilobytes, megabytes, gigabytes, terabytes and petabytes. Toggle SI (decimal) and IEC (binary) standards.',
      siFactor: 1000,
      units: {
        bit:         { name: 'Bit',         symbol: 'b',   toBase: 1,           step: 'bit',    offset: 0 },
        byte:        { name: 'Byte',        symbol: 'B',   toBase: 8,           step: 'byte',   offset: 0 },
        kilobit:     { name: 'Kilobit',     symbol: 'kb',  toBase: 1e3,         step: 'si',     offset: 0 },
        kilobyte:    { name: 'Kilobyte',    symbol: 'kB',  toBase: 8e3,         step: 'byte',   offset: 0 },
        megabit:     { name: 'Megabit',     symbol: 'Mb',  toBase: 1e6,         step: 'si',     offset: 0 },
        megabyte:    { name: 'Megabyte',    symbol: 'MB',  toBase: 8e6,         step: 'byte',   offset: 0 },
        gigabit:     { name: 'Gigabit',     symbol: 'Gb',  toBase: 1e9,         step: 'si',     offset: 0 },
        gigabyte:    { name: 'Gigabyte',    symbol: 'GB',  toBase: 8e9,         step: 'byte',   offset: 0 },
        terabit:     { name: 'Terabit',     symbol: 'Tb',  toBase: 1e12,        step: 'si',     offset: 0 },
        terabyte:    { name: 'Terabyte',    symbol: 'TB',  toBase: 8e12,        step: 'byte',   offset: 0 },
        petabyte:    { name: 'Petabyte',    symbol: 'PB',  toBase: 8e15,        step: 'byte',   offset: 0 },
      },
    },

    angle: {
      name: 'Angle',
      slug: 'angle',
      metaName: 'Angle Converter',
      description:
        'Convert between degrees, radians, gradians, arcminutes and arcseconds.',
      units: {
        degree:   { name: 'Degree',   symbol: '°',  aliases: ['degrees'], toBase: Math.PI / 180 },
        radian:   { name: 'Radian',   symbol: 'rad', aliases: ['radians'], toBase: 1 },
        gradian:  { name: 'Gradian',  symbol: 'gon', aliases: ['grads', 'gradian'], toBase: Math.PI / 200 },
        arcminute:{ name: 'Arcminute',symbol: "'",  aliases: ['arcminutes'], toBase: Math.PI / 10800 },
        arcsecond:{ name: 'Arcsecond',symbol: '"',  aliases: ['arcseconds'], toBase: Math.PI / 648000 },
      },
    },

    frequency: {
      name: 'Frequency',
      slug: 'frequency',
      metaName: 'Frequency Converter',
      description: 'Convert between hertz, kilohertz, megahertz, gigahertz and revolutions per minute.',
      units: {
        hertz:     { name: 'Hertz',     symbol: 'Hz',  toBase: 1 },
        kilohertz: { name: 'Kilohertz', symbol: 'kHz', toBase: 1e3 },
        megahertz: { name: 'Megahertz', symbol: 'MHz', toBase: 1e6 },
        gigahertz: { name: 'Gigahertz', symbol: 'GHz', toBase: 1e9 },
        terahertz: { name: 'Terahertz', symbol: 'THz', toBase: 1e12 },
        rpm:       { name: 'RPM',       symbol: 'rpm', toBase: 1 / 60 },
      },
    },

    fuelEconomy: {
      name: 'Fuel Economy',
      slug: 'fuel-economy',
      metaName: 'Fuel Economy Converter',
      description: 'Convert between MPG (US & UK), L/100km and km/L.',
      units: {
        mpgUS:    { name: 'Miles / Gallon (US)', symbol: 'MPG (US)', fromBase: 2.352145 },     // 235.215 / 100
        mpgUK:    { name: 'Miles / Gallon (UK)', symbol: 'MPG (UK)', fromBase: 2.824809 },
        l100km:   { name: 'Liters / 100km',      symbol: 'L/100km', fromBase: 'L100KM' },
        kmPerL:   { name: 'Kilometers / Liter',  symbol: 'km/L',   fromBase: 'KMPL' },
      },
    },
  };

  // 温度公式（无 base 因子）
  const TEMP_FORMULAS = {
    celsius: {
      toBase: {
        fahrenheit: (c) => c * 9 / 5 + 32,
        kelvin:     (c) => c + 273.15,
        rankine:    (c) => (c + 273.15) * 9 / 5,
        celsius:    (c) => c,
      },
      fromBase: {
        celsius:    (k) => k - 273.15,
        fahrenheit: (k) => k * 9 / 5 - 459.67,
        kelvin:     (k) => k,
        rankine:    (k) => k * 9 / 5,
      },
    },
  };
  // 兼容旧调用：celsius -> kelvin 直接调用
  function tempConvert(value, fromKey, toKey) {
    if (fromKey === toKey) return value;
    // via Kelvin
    const toK =
      fromKey === 'kelvin' ? value :
      fromKey === 'celsius' ? value + 273.15 :
      fromKey === 'fahrenheit' ? (value - 32) * 5 / 9 + 273.15 :
      fromKey === 'rankine' ? value * 5 / 9 :
      NaN;
    return toK === NaN ? NaN :
      toKey === 'kelvin' ? toK :
      toKey === 'celsius' ? toK - 273.15 :
      toKey === 'fahrenheit' ? (toK - 273.15) * 9 / 5 + 32 :
      toKey === 'rankine' ? toK * 9 / 5 :
      NaN;
  }

  function fuelConvert(value, fromKey, toKey) {
    // base = L/100km
    const toL100 = (v, k) =>
      k === 'l100km' ? v :
      k === 'mpgUS' ? 235.215 / v :
      k === 'mpgUK' ? 282.481 / v :
      k === 'kmPerL' ? 100 / v : NaN;
    const l100 = toL100(value, fromKey);
    if (toKey === 'l100km') return l100;
    if (toKey === 'mpgUS') return 235.215 / l100;
    if (toKey === 'mpgUK') return 282.481 / l100;
    if (toKey === 'kmPerL') return 100 / l100;
    return NaN;
  }

  // ===== 长尾换算对：精选 =====
  // 每条 = { slug, category, from, to, h1Template, metaDescription, faq: [...] }
  const _FEATURED_PAIRS_SRC = [
    // —— Length ——
    { slug: 'mm-to-inches',     cat: 'length',     from: 'millimeter', to: 'inch' },
    { slug: 'inches-to-mm',     cat: 'length',     from: 'inch',       to: 'millimeter' },
    { slug: 'cm-to-inches',     cat: 'length',     from: 'centimeter', to: 'inch' },
    { slug: 'inches-to-cm',     cat: 'length',     from: 'inch',       to: 'centimeter' },
    { slug: 'cm-to-feet',       cat: 'length',     from: 'centimeter', to: 'foot' },
    { slug: 'feet-to-cm',       cat: 'length',     from: 'foot',       to: 'centimeter' },
    { slug: 'meters-to-feet',   cat: 'length',     from: 'meter',      to: 'foot' },
    { slug: 'feet-to-meters',   cat: 'length',     from: 'foot',       to: 'meter' },
    { slug: 'km-to-miles',      cat: 'length',     from: 'kilometer',  to: 'mile' },
    { slug: 'miles-to-km',      cat: 'length',     from: 'mile',       to: 'kilometer' },
    { slug: 'yards-to-feet',    cat: 'length',     from: 'yard',       to: 'foot' },
    { slug: 'feet-to-inches',   cat: 'length',     from: 'foot',       to: 'inch' },

    // —— Weight ——
    { slug: 'kg-to-lbs',        cat: 'weight',     from: 'kilogram',   to: 'pound' },
    { slug: 'lbs-to-kg',        cat: 'weight',     from: 'pound',      to: 'kilogram' },
    { slug: 'grams-to-ounces',  cat: 'weight',     from: 'gram',       to: 'ounce' },
    { slug: 'ounces-to-grams',  cat: 'weight',     from: 'ounce',      to: 'gram' },
    { slug: 'kg-to-grams',      cat: 'weight',     from: 'kilogram',   to: 'gram' },
    { slug: 'pounds-to-stones', cat: 'weight',     from: 'pound',      to: 'stone' },
    { slug: 'stones-to-kg',     cat: 'weight',     from: 'stone',      to: 'kilogram' },
    { slug: 'grams-to-pounds',  cat: 'weight',     from: 'gram',       to: 'pound' },

    // —— Volume ——
    { slug: 'gallons-to-liters',cat: 'volume',     from: 'gallonUS',   to: 'liter' },
    { slug: 'liters-to-gallons',cat: 'volume',     from: 'liter',      to: 'gallonUS' },
    { slug: 'cups-to-ml',       cat: 'volume',     from: 'cupUS',      to: 'milliliter' },
    { slug: 'ml-to-cups',       cat: 'volume',     from: 'milliliter', to: 'cupUS' },
    { slug: 'oz-to-ml',         cat: 'volume',     from: 'fluidOunceUS',to:'milliliter' },
    { slug: 'ml-to-oz',         cat: 'volume',     from: 'milliliter', to: 'fluidOunceUS' },
    { slug: 'tablespoons-to-cups', cat: 'volume',  from: 'tablespoon', to: 'cupUS' },
    { slug: 'cups-to-tablespoons', cat: 'volume',  from: 'cupUS',      to: 'tablespoon' },
    { slug: 'tbsp-to-ml',       cat: 'volume',     from: 'tablespoon', to: 'milliliter' },
    { slug: 'quarts-to-liters', cat: 'volume',     from: 'quartUS',    to: 'liter' },
    { slug: 'pints-to-liters',  cat: 'volume',     from: 'pintUS',     to: 'liter' },
    { slug: 'cubic-feet-to-cubic-meters', cat: 'volume', from: 'cubicFoot', to: 'cubicMeter' },

    // —— Temperature ——
    { slug: 'celsius-to-fahrenheit', cat: 'temperature', from: 'celsius', to: 'fahrenheit' },
    { slug: 'fahrenheit-to-celsius', cat: 'temperature', from: 'fahrenheit', to: 'celsius' },
    { slug: 'celsius-to-kelvin',     cat: 'temperature', from: 'celsius', to: 'kelvin' },
    { slug: 'kelvin-to-celsius',     cat: 'temperature', from: 'kelvin', to: 'celsius' },

    // —— Pressure ——
    { slug: 'psi-to-bar',       cat: 'pressure',   from: 'psi',        to: 'bar' },
    { slug: 'bar-to-psi',       cat: 'pressure',   from: 'bar',        to: 'psi' },
    { slug: 'kpa-to-psi',       cat: 'pressure',   from: 'kilopascal', to: 'psi' },
    { slug: 'psi-to-kpa',       cat: 'pressure',   from: 'psi',        to: 'kilopascal' },
    { slug: 'atm-to-psi',       cat: 'pressure',   from: 'atmosphere', to: 'psi' },

    // —— Speed ——
    { slug: 'mph-to-kmh',       cat: 'speed',      from: 'milePerHour', to: 'kilometerPerHour' },
    { slug: 'kmh-to-mph',       cat: 'speed',      from: 'kilometerPerHour', to: 'milePerHour' },
    { slug: 'mps-to-mph',       cat: 'speed',      from: 'meterPerSecond', to: 'milePerHour' },
    { slug: 'knots-to-mph',     cat: 'speed',      from: 'knot',        to: 'milePerHour' },

    // —— Time ——
    { slug: 'seconds-to-minutes', cat: 'time',      from: 'second',     to: 'minute' },
    { slug: 'minutes-to-seconds', cat: 'time',      from: 'minute',     to: 'second' },
    { slug: 'hours-to-minutes',   cat: 'time',      from: 'hour',       to: 'minute' },
    { slug: 'days-to-hours',      cat: 'time',      from: 'day',        to: 'hour' },
    { slug: 'weeks-to-days',      cat: 'time',      from: 'week',       to: 'day' },

    // —— Energy ——
    { slug: 'calories-to-joules',     cat: 'energy', from: 'calorie',     to: 'joule' },
    { slug: 'joules-to-calories',     cat: 'energy', from: 'joule',       to: 'calorie' },
    { slug: 'kilocalories-to-joules', cat: 'energy', from: 'kilocalorie', to: 'joule' },
    { slug: 'kwh-to-btu',             cat: 'energy', from: 'kilowattHour',to: 'btu' },

    // —— Data ——
    { slug: 'mb-to-gb',         cat: 'data',       from: 'megabyte',   to: 'gigabyte' },
    { slug: 'gb-to-mb',         cat: 'data',       from: 'gigabyte',   to: 'megabyte' },
    { slug: 'mb-to-kb',         cat: 'data',       from: 'megabyte',   to: 'kilobyte' },
    { slug: 'kb-to-mb',         cat: 'data',       from: 'kilobyte',   to: 'megabyte' },
    { slug: 'gb-to-tb',         cat: 'data',       from: 'gigabyte',   to: 'terabyte' },
    { slug: 'tb-to-gb',         cat: 'data',       from: 'terabyte',   to: 'gigabyte' },

    // —— Area ——
    { slug: 'sqft-to-sqm',      cat: 'area',       from: 'squareFoot',  to: 'squareMeter' },
    { slug: 'sqm-to-sqft',      cat: 'area',       from: 'squareMeter', to: 'squareFoot' },
    { slug: 'acres-to-hectares',cat: 'area',       from: 'acre',        to: 'hectare' },
    { slug: 'hectares-to-acres',cat: 'area',       from: 'hectare',     to: 'acre' },
    { slug: 'sqft-to-acres',    cat: 'area',       from: 'squareFoot',  to: 'acre' },

    // —— Angle ——
    { slug: 'degrees-to-radians', cat: 'angle',    from: 'degree',      to: 'radian' },
    { slug: 'radians-to-degrees', cat: 'angle',    from: 'radian',      to: 'degree' },

    // —— Frequency ——
    { slug: 'hz-to-khz',        cat: 'frequency',  from: 'hertz',       to: 'kilohertz' },
    { slug: 'mhz-to-khz',       cat: 'frequency',  from: 'megahertz',   to: 'kilohertz' },
    { slug: 'ghz-to-mhz',       cat: 'frequency',  from: 'gigahertz',   to: 'megahertz' },

    // —— Cooking（跨类别：grams<->cups/tbsp，依赖食材密度） ——
    { slug: 'grams-to-cups',         cat: 'weight', from: 'gram', to: 'cupUS',      cross: 'volume', density: 240,    material: 'water (1 cup ≈ 240 g)' },
    { slug: 'butter-grams-to-tbsp',  cat: 'weight', from: 'gram', to: 'tablespoon', cross: 'volume', density: 14.175, material: 'butter (1 tbsp ≈ 14.175 g)' },
    { slug: 'flour-grams-to-cups',   cat: 'weight', from: 'gram', to: 'cupUS',      cross: 'volume', density: 125,    material: 'all-purpose flour (1 cup ≈ 125 g)' },
    { slug: 'sugar-grams-to-cups',   cat: 'weight', from: 'gram', to: 'cupUS',      cross: 'volume', density: 200,    material: 'granulated sugar (1 cup ≈ 200 g)' },
  ];

  // 用 slug 找对
  function pairBySlug(slug) {
    return FEATURED_PAIRS.find(p => p.slug === slug);
  }

  // ===== 自动镜像反向对 =====
  // 解决"点 ⇄ 按钮跳到原页"的 bug：
  // 手工写的精选列表经常缺反向条目（kg→grams 写了但 grams→kg 漏了）。
  // 这里扫描整个列表，自动补全缺的反向 pair（同样类别内 from/to 互换，
  // 跨类别 cooking 也会带上 density/cross/material 字段）。
  const FEATURED_PAIRS = (function () {
    const list = _FEATURED_PAIRS_SRC.slice();
    const slugSet = new Set(list.map(p => p.slug));
    const unitPairSet = new Set(list.map(p => `${p.from}→${p.to}`));
    for (const p of _FEATURED_PAIRS_SRC) {
      const m = p.slug.match(/^(.+)-to-(.+)$/);
      if (!m) continue;
      const revSlug = `${m[2]}-to-${m[1]}`;
      if (slugSet.has(revSlug)) continue;
      const revUnitPair = `${p.to}→${p.from}`;
      if (unitPairSet.has(revUnitPair)) continue;
      list.push({
        slug: revSlug,
        cat: p.cat,
        from: p.to,
        to: p.from,
        // 跨类别/密度/食材字段一并镜像
        density: p.density,
        hint: p.hint,
        cross: p.cross,
        material: p.material
      });
      slugSet.add(revSlug);
      unitPairSet.add(revUnitPair);
    }
    return list;
  })();


  // 通用换算（线性单位）
  function linearConvert(value, cat, fromKey, toKey) {
    const u = UNIT_DATA[cat].units;
    return (value * u[fromKey].toBase) / u[toKey].toBase;
  }

  function convert(value, cat, fromKey, toKey, opts) {
    if (cat === 'temperature') return tempConvert(value, fromKey, toKey);
    if (cat === 'fuelEconomy') return fuelConvert(value, fromKey, toKey);
    // Cooking cross-category: grams ↔ cups/tbsp uses ingredient density (g per cup or tbsp).
    // e.g. 1 cup water = 240 g; 1 cup flour = 125 g. So 100 g flour ≈ 0.8 cup.
    if (opts && typeof opts.density === 'number') {
      // 当 from 在 weight 类，to 在 volume 类时，grams -> cups = grams / density
      // 反向：cups -> grams = cups * density（若对称反向，引擎自动通过 swap 切到反向 slug）
      return value / opts.density;
    }
    return linearConvert(value, cat, fromKey, toKey);
  }

  // ===== 暴露 =====
  const exported = {
    UNIT_DATA,
    FEATURED_PAIRS,
    convert,
    linearConvert,
    tempConvert,
    fuelConvert,
    pairBySlug,
  };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exported;
  } else if (typeof window !== 'undefined') {
    window.UnitWise = exported;
  } else if (root) {
    root.UnitWise = exported;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null));
