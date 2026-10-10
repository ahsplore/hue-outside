import type { DailyColor } from '../types';


export const COLOR_PALETTE: DailyColor[] = [
  {
    id: 'forest-green',
    name: 'Forest Green',
    hex: '#2D5A40',
    rgb: '45, 90, 64',
    family: 'green',
    lightText: true,
    natureFact: 'Chlorophyll a absorbs red and blue light, reflecting deep forest green to drive the photosynthesis powering Earth’s ancient canopies.',
    natureHints: ['Underside of mature oak leaves', 'Evergreen pine needles', 'Damp velvet moss on north-facing rocks', 'Dense fern fronds'],
    everydayHints: ['Vintage canvas backpack', 'Dark green ceramic mug', 'Matcha green tea tin', 'British racing green notebook'],
    seasonRelevance: 'Abundant year-round in evergreens and lush temperate forests.'
  },
  {
    id: 'sunflower-yellow',
    name: 'Sunflower Yellow',
    hex: '#E8A838',
    rgb: '232, 168, 56',
    family: 'yellow',
    lightText: false,
    natureFact: 'Lutein, a natural carotenoid antioxidant, gives sunflowers, autumn birch leaves, and marigolds their vibrant sunny hue.',
    natureHints: ['Late summer sunflower petals', 'Golden autumn aspen leaves', 'Dandelion crowns', 'Morning honey bee pollen sacs'],
    everydayHints: ['Yellow rain boots', 'Post-it sticky note', 'Fresh lemon peel', 'Transit taxi or school bus'],
    seasonRelevance: 'Peaks in midsummer to early autumn across fields and meadows.'
  },
  {
    id: 'sky-blue',
    name: 'Sky Blue',
    hex: '#6BA4C8',
    rgb: '107, 164, 200',
    family: 'blue',
    lightText: false,
    natureFact: 'Rayleigh scattering causes nitrogen and oxygen molecules in our atmosphere to scatter short blue wavelengths more than other colors.',
    natureHints: ['Cloudless midday sky', 'Robin egg shells in spring', 'Reflection on a calm alpine lake', 'Forget-me-not petals'],
    everydayHints: ['Faded denim jacket', 'Blue enamel camp cup', 'Painter’s masking tape', 'Cotton summer shirt'],
    seasonRelevance: 'Clear high-pressure morning skies across all seasons.'
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    hex: '#C86343',
    rgb: '200, 99, 67',
    family: 'terracotta',
    lightText: true,
    natureFact: 'Iron oxide (rust) baked into sedimentary soil and clay gives terracotta its warm, primal, earthly warmth.',
    natureHints: ['Sun-baked clay riverbed', 'Fallen copper beech leaves', 'Red canyon sandstone', 'Dried autumn pine cones'],
    everydayHints: ['Unglazed clay flowerpot', 'Terracotta roof tiles', 'Leather watch strap', 'Ceramic baking dish'],
    seasonRelevance: 'Warm earthy foundation during autumn and desert dry seasons.'
  },
  {
    id: 'lavender-mist',
    name: 'Lavender Mist',
    hex: '#9D8EC2',
    rgb: '157, 142, 194',
    family: 'purple',
    lightText: false,
    natureFact: 'Anthocyanins in flower petals shift between pink, purple, and blue depending on the cellular pH of the petals.',
    natureHints: ['Blooming lavender spikes', 'Creeping wild thyme', 'Lilac blossoms in breeze', 'Dusk horizon before twilight'],
    everydayHints: ['Lavender scented candle label', 'Silk neck scarf', 'Pastel watercolor tube', 'Herbal tea box'],
    seasonRelevance: 'Early summer gardens and dusk gradients.'
  },
  {
    id: 'rose-pink',
    name: 'Rose Pink',
    hex: '#D97084',
    rgb: '217, 112, 132',
    family: 'pink',
    lightText: true,
    natureFact: 'Pink floral pigments are specifically tuned by evolution to attract hummingbirds and long-tongued wild bees.',
    natureHints: ['Wild rosehip flower petals', 'Pink quartz pebble in a creek', 'Morning dawn clouds', 'Crabapple blossoms'],
    everydayHints: ['Rosehip tea infusion', 'Cotton baseball cap', 'Lip balm tin', 'Pink eraser'],
    seasonRelevance: 'Spring blooms and delicate dawn sunrises.'
  },
  {
    id: 'coral-reef',
    name: 'Coral Reef',
    hex: '#E3735E',
    rgb: '227, 115, 94',
    family: 'terracotta',
    lightText: true,
    natureFact: 'Symbiotic zooxanthellae algae and carotenoid proteins produce the vivid warm coral spectrum in marine and terrestrial flora.',
    natureHints: ['Ripe persimmon skin', 'Sunset rim on ocean horizon', 'Chanterelle mushroom cap', 'Autumn sugar maple leaf'],
    everydayHints: ['Coral yoga mat', 'Retro bicycle frame', 'Fresh grapefruit slice', 'Canvas tote bag'],
    seasonRelevance: 'Autumn foliage transitions and tropical marine edges.'
  },
  {
    id: 'sage-leaf',
    name: 'Sage Leaf',
    hex: '#7D9882',
    rgb: '125, 152, 130',
    family: 'green',
    lightText: false,
    natureFact: 'Microscopic trichome hairs on sage leaves reflect sunlight, scattering light to give the foliage a gentle silvery-green glow.',
    natureHints: ['Garden sage or rosemary herb', 'Eucalyptus tree leaves', 'Lichen on tree bark', 'Silver dollar succulent'],
    everydayHints: ['Linen dinner napkin', 'Ceramic plant saucer', 'Matt tea tin', 'Sage green knit sweater'],
    seasonRelevance: 'Dry Mediterranean summer scrubs and coastal gardens.'
  },
  {
    id: 'marigold-gold',
    name: 'Marigold Gold',
    hex: '#EA8C2F',
    rgb: '234, 140, 47',
    family: 'yellow',
    lightText: true,
    natureFact: 'Marigolds produce intense orange carotenoids that deter unwanted insects while guiding beneficial pollinators straight to the nectar.',
    natureHints: ['French marigold blossom', 'Monarch butterfly wing edge', 'Ripe winter squash', 'Dried apricot'],
    everydayHints: ['Safety warning cone', 'Citrus tangerine', 'Field notebook cover', 'Amber glass bottle'],
    seasonRelevance: 'Harvest season, late summer into late autumn.'
  },
  {
    id: 'plum-twilight',
    name: 'Plum Twilight',
    hex: '#673C58',
    rgb: '103, 60, 88',
    family: 'purple',
    lightText: true,
    natureFact: 'Dense concentrations of pelargonidin and cyanidin pigments protect dark fruit skins from ultraviolet radiation damage.',
    natureHints: ['Ripe wild blackberry', 'Dark purple elderberry cluster', 'Ornamental purple cabbage', 'Shadow of mountain ridge at sunset'],
    everydayHints: ['Fountain pen ink bottle', 'Plum leather wallet', 'Red wine bottle seal', 'Wool winter beanie'],
    seasonRelevance: 'Late summer berry foraging and winter twilights.'
  },
  {
    id: 'ocean-teal',
    name: 'Ocean Teal',
    hex: '#2E8B9A',
    rgb: '46, 139, 154',
    family: 'blue',
    lightText: true,
    natureFact: 'Water absorbs red light within the first few meters; phytoplankton pigments reflect mixed green-blue back to the surface.',
    natureHints: ['Coastal surf edge', 'Glacial mountain stream pool', 'Mallard duck neck feather', 'Raw turquoise stone'],
    everydayHints: ['Enamel kettle', 'Teal wool scarf', 'Passport cover', 'Ceramic glazed coaster'],
    seasonRelevance: 'Coastal waters and high mountain melt lakes.'
  },
  {
    id: 'moss-green',
    name: 'Moss Green',
    hex: '#5B7B4B',
    rgb: '91, 123, 75',
    family: 'green',
    lightText: true,
    natureFact: 'Bryophytes (mosses) have survived for over 450 million years, absorbing water and nutrients directly through soft green leaf cells.',
    natureHints: ['Cushion moss on ancient tree root', 'Cedar swamp undergrowth', 'Spring willow bud', 'Algae on river pebble'],
    everydayHints: ['Felt pencil case', 'Corduroy trousers', 'Green glass olive oil bottle', 'Canvas tent fabric'],
    seasonRelevance: 'Damp spring mornings and mist-shrouded autumns.'
  },
  {
    id: 'amber-ochre',
    name: 'Amber Ochre',
    hex: '#C28E38',
    rgb: '194, 142, 56',
    family: 'earth',
    lightText: true,
    natureFact: 'Limonite and clay earth pigments were among the very first natural colors ever ground by prehistoric cave painters 40,000 years ago.',
    natureHints: ['Fossilized tree resin amber', 'Dry meadow prairie grass', 'Chestnut mushroom stem', 'Ginkgo biloba leaf'],
    everydayHints: ['Craft paper envelope', 'Wooden cutting board edge', 'Beeswax pillar candle', 'Leather journal cover'],
    seasonRelevance: 'Late autumn prairies and golden hour sunlight.'
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    hex: '#EE9CA7',
    rgb: '238, 156, 167',
    family: 'pink',
    lightText: false,
    natureFact: 'Sakura blossoms produce delicate shades of pink during a brief 10-day spring window to signal pollinating insects.',
    natureHints: ['Cherry tree blossom petal', 'Pink sea shell on wet sand', 'Morning alpine glow on snow peak', 'Sweet pea flower'],
    everydayHints: ['Strawberry milk carton', 'Pink stationery note card', 'Rose quartz paperweight', 'Canvas sneaker accent'],
    seasonRelevance: 'Spring revival and orchard blooms.'
  },
  {
    id: 'burnt-sienna',
    name: 'Burnt Sienna',
    hex: '#A04B35',
    rgb: '160, 75, 53',
    family: 'terracotta',
    lightText: true,
    natureFact: 'Heating raw sienna drives off water molecules, chemically converting ferric hydroxide into deep, warm red ferric oxide.',
    natureHints: ['Fallen red oak leaf', 'Red clay pathway', 'Fox fur in sunlight', 'Weathered red slate stone'],
    everydayHints: ['Brick garden border', 'Terracotta espresso cup', 'Leather work boots', 'Clay chiminea'],
    seasonRelevance: 'Crisp autumn trails and woodland walks.'
  },
  {
    id: 'citrus-lime',
    name: 'Citrus Lime',
    hex: '#8DAF2A',
    rgb: '141, 175, 42',
    family: 'green',
    lightText: false,
    natureFact: 'Young spring shoots contain high levels of protochlorophyll, giving fresh new growth a luminous zesty lime cast.',
    natureHints: ['New beech tree leaves in May', 'Lime fruit skin', 'Tree frog belly', 'Sprouting wheatgrass'],
    everydayHints: ['Tennis ball', 'Highlighter marker cap', 'Lime citrus soda can', 'Bright kitchen silicone spatula'],
    seasonRelevance: 'Early spring awakening and energetic growth.'
  },
  {
    id: 'cornflower-blue',
    name: 'Cornflower Blue',
    hex: '#4D82B8',
    rgb: '77, 130, 184',
    family: 'blue',
    lightText: true,
    natureFact: 'Protocyanin, a supramolecular metal-pigment complex with iron and magnesium, produces the pure, non-fading blue of wild cornflowers.',
    natureHints: ['Wild chicory wildflower', 'Blue jay wing feather', 'Mountain bluebird', 'Gentian blossom along high trail'],
    everydayHints: ['Classic blue ballpoint pen', 'Blue ceramic bowl', 'Cotton bandanna', 'Blue jeans stitching'],
    seasonRelevance: 'Midsummer roadsides and meadow perimeters.'
  },
  {
    id: 'poppy-red',
    name: 'Poppy Red',
    hex: '#D63D33',
    rgb: '214, 61, 51',
    family: 'earth',
    lightText: true,
    natureFact: 'Field poppies produce cyanidin glycosides in gossamer-thin petals, creating an unmistakable flash of primary red across green fields.',
    natureHints: ['Wild corn poppy in grassy verge', 'Ripe autumn rosehip', 'Ladybug wing shell', 'Red cardinal bird breast'],
    everydayHints: ['Red post box or fire hydrant', 'Tomato soup can label', 'Red bicycle bell', 'Cherry keychain'],
    seasonRelevance: 'Early summer meadow borders and late summer fruits.'
  },
  {
    id: 'wisteria-lilac',
    name: 'Wisteria Lilac',
    hex: '#B399C8',
    rgb: '179, 153, 200',
    family: 'purple',
    lightText: false,
    natureFact: 'Hanging racemes of wisteria release sweet monoterpene scents alongside their pale lilac petals to attract early bumblebees.',
    natureHints: ['Hanging wisteria cluster', 'Wild crocus in early grass', 'Amethyst crystal cluster', 'Twilight haze over hills'],
    everydayHints: ['Pastel lilac pen', 'Lavender sachet bag', 'Wool knit socks', 'Decorative tea mug'],
    seasonRelevance: 'Mid-spring garden trellises and mountain passes.'
  },
  {
    id: 'clay-beige',
    name: 'Clay Beige',
    hex: '#BA9F81',
    rgb: '186, 159, 129',
    family: 'earth',
    lightText: false,
    natureFact: 'Sedimentary silt deposited by winding rivers forms natural warm beige clay rich in quartz micro-crystals.',
    natureHints: ['Riverbed sandstone pebble', 'Dried wild oat stalks', 'White birch bark interior', 'Dried driftwood on shore'],
    everydayHints: ['Linen apron', 'Cardboard shipping box', 'Beige ceramic coffee tumbler', 'Canvas tote bag'],
    seasonRelevance: 'Year-round organic minimalist earth tones.'
  },
  {
    id: 'mountain-slate',
    name: 'Mountain Slate',
    hex: '#566A78',
    rgb: '86, 106, 120',
    family: 'blue',
    lightText: true,
    natureFact: 'Metamorphic pressure over hundreds of millions of years compresses shale into smooth, weather-resistant blue-gray slate.',
    natureHints: ['River stone wet with spray', 'Storm cloud underside', 'Blue spruce foliage', 'Pigeon neck plumage'],
    everydayHints: ['Slate coaster', 'Dark denim jacket', 'Graphite pencil barrel', 'Matte gray water bottle'],
    seasonRelevance: 'Misty rainy days and high rocky trails.'
  }
];

/**
 * Deterministically get the daily color for any given date string (YYYY-MM-DD).
 * Stable across page refreshes, timezones, and devices!
 */
export function getDailyColorForDate(dateStr: string): DailyColor {
  // Simple hash function for string
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const positiveHash = Math.abs(hash);
  const index = positiveHash % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
}

/**
 * Format a Date object to YYYY-MM-DD using local time
 */
export function formatLocalDate(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get friendly display string: e.g. "Sunday, October 11, 2026"
 */
export function formatFriendlyDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Short month & day: e.g. "Oct 11"
 */
export function formatShortDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}
