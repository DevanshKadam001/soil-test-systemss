/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SoilAnalysis } from "./types";

export interface SoilPreset {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  sampleAnalysis: SoilAnalysis;
}

export const SOIL_PRESETS: SoilPreset[] = [
  {
    id: "loamy",
    name: "Rich Loam Soil",
    description: "Dark, crumbly soil containing a balanced mix of sand, silt, and clay with high organic matter.",
    imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=600",
    sampleAnalysis: {
      soilType: "Loamy Soil",
      confidenceScore: 98,
      color: "Deep dark brown or black, indicating high organic humus content.",
      texture: "Soft, crumbly, and slightly gritty but holds its shape when squeezed gently.",
      phRange: "6.0 - 7.0 (Slightly acidic to neutral)",
      moistureRetention: "High to moderate. Absorbs water efficiently while draining well to prevent waterlogging.",
      nutrientProfile: [
        "Rich in Nitrogen (N) for lush leafy growth",
        "High Phosphorus (P) levels for strong root development",
        "Excellent Potassium (K) retention for disease resistance",
        "Abundant organic matter and microbial activity"
      ],
      keyCharacteristics: [
        "Perfect balance of clay (retention) and sand/silt (drainage)",
        "Aerated structure allows easy root expansion",
        "Easily workable and resistant to heavy compaction",
        "Holds nutrients extremely well without leaching"
      ],
      suitableCrops: [
        {
          name: "Tomatoes",
          type: "Vegetable",
          whySuitable: "Tomatoes require high nutrient levels and consistent moisture, which loam soil naturally provides.",
          sowingSeason: "Spring (after final frost)",
          waterRequirement: "Moderate (consistent 1-2 inches per week)",
          careTips: [
            "Add support stakes early to prevent ground contact",
            "Prune side suckers to improve ventilation and yield",
            "Apply mulch to maintain steady moisture levels"
          ]
        },
        {
          name: "Carrots",
          type: "Vegetable",
          whySuitable: "The loose, non-compacted crumbly texture of loam allows carrot roots to grow deep, straight, and unhindered.",
          sowingSeason: "Early Spring to Mid Summer",
          waterRequirement: "Moderate (keep soil surface moist during germination)",
          careTips: [
            "Thin out seedlings to 2-3 inches apart to give roots space",
            "Avoid excessive nitrogen fertilizers which can cause branching",
            "Keep soil weed-free to prevent root competition"
          ]
        },
        {
          name: "Wheat",
          type: "Grain",
          whySuitable: "Wheat thrives in well-drained loam which supplies steady nutrients and supports strong stalk anchoring.",
          sowingSeason: "Autumn (Winter wheat) or Spring (Spring wheat)",
          waterRequirement: "Moderate (critical during tillering and flowering)",
          careTips: [
            "Sow in uniform depth for synchronous germination",
            "Monitor for rust fungus during humid spells",
            "Harvest when grains are hard and stalks turn golden-yellow"
          ]
        }
      ],
      soilImprovementTips: [
        "Apply a thin layer of compost annually to replenish consumed organic matter.",
        "Practice crop rotation to maintain a balanced nutrient profile and prevent pathogen build-up.",
        "Avoid tilling or working the soil when excessively wet to preserve its natural structure."
      ],
      funFact: "Loam soil is often considered the 'holy grail' of gardening and farming. It gets its stellar qualities from its balanced proportions: roughly 40% sand, 40% silt, and 20% clay!"
    }
  },
  {
    id: "sandy",
    name: "Dry Sandy Soil",
    description: "Light, warm, dry soil with large gritty particles that drains water rapidly.",
    imageUrl: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&q=80&w=600",
    sampleAnalysis: {
      soilType: "Sandy Soil",
      confidenceScore: 95,
      color: "Light tan, pale grey, or yellowish-white.",
      texture: "Gritty, coarse, and loose. Does not hold its shape when squeezed; falls apart easily.",
      phRange: "5.5 - 6.5 (Slightly acidic to moderately acidic)",
      moistureRetention: "Low. Water drains through rapidly, leading to dry conditions and quick drying of topsoil.",
      nutrientProfile: [
        "Low in Nitrogen (N) due to rapid leaching",
        "Low Phosphorus (P) retention",
        "Highly deficient in Potassium (K) and trace elements",
        "Very low organic matter content"
      ],
      keyCharacteristics: [
        "Rapid drainage and high aeration",
        "Warms up extremely quickly in spring, enabling early sowing",
        "Extremely easy to till and cultivate",
        "Prone to erosion by wind and heavy rain"
      ],
      suitableCrops: [
        {
          name: "Potatoes",
          type: "Root Crop",
          whySuitable: "Sandy soil is loose and warm, which prevents waterlogged rot in potato tubers and allows clean, easy harvesting.",
          sowingSeason: "Mid Spring",
          waterRequirement: "Moderate (needs frequent light watering rather than occasional heavy watering)",
          careTips: [
            "Hill the soil around growing stems to cover tubers from sunlight",
            "Provide light, organic slow-release fertilizers repeatedly",
            "Monitor soil closely since it dries out rapidly in heat waves"
          ]
        },
        {
          name: "Lavender",
          type: "Herb / Flower",
          whySuitable: "Lavender is native to Mediterranean climates and demands dry, fast-draining, nutrient-lean soil; wet roots will kill it.",
          sowingSeason: "Spring",
          waterRequirement: "Low (drought-tolerant once established)",
          careTips: [
            "Avoid organic compost around roots; prefers mineral mulch like pebbles",
            "Prune lightly after flowering to maintain a neat bushy shape",
            "Ensure full sun exposure for maximum essential oil concentration"
          ]
        },
        {
          name: "Watermelon",
          type: "Fruit",
          whySuitable: "Watermelons love the warm, loose root environment of sandy soil and deep sun warmth to develop sweetness.",
          sowingSeason: "Late Spring (when soil is thoroughly warm)",
          waterRequirement: "High (deep watering, but drainage is essential to avoid rind rot)",
          careTips: [
            "Use black plastic mulch to trap extra ground heat if in temperate zones",
            "Water at the base to keep foliage dry and reduce mildew",
            "Pinch off end runners to focus energy on 2-3 main fruits"
          ]
        }
      ],
      soilImprovementTips: [
        "Incorporate heavy quantities of organic compost or well-rotted manure to boost moisture and nutrient holding capacity.",
        "Grow winter cover crops (like clover or rye) to bind the loose sand particles together and prevent winter erosion.",
        "Apply organic mulches (bark, wood chips, leaves) to slow down evaporation from the surface."
      ],
      funFact: "Because sandy soil warms up much quicker than clay or loam, early-season market gardeners prize sandy fields for being able to harvest spring crops weeks ahead of others!"
    }
  },
  {
    id: "clay",
    name: "Heavy Clay Soil",
    description: "Dense, nutrient-rich soil made of tiny mineral particles that holds water but gets sticky and compacted easily.",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
    sampleAnalysis: {
      soilType: "Clay Soil",
      confidenceScore: 96,
      color: "Reddish-brown, dark grey, or yellow-grey when dry; sticky and shiny dark slick when wet.",
      texture: "Sticky, smooth, and plastic-like when wet. Becomes rock-hard, cracked, and dense when dry.",
      phRange: "7.0 - 8.0 (Neutral to slightly alkaline)",
      moistureRetention: "Extremely high. Holds water for long periods but is highly prone to waterlogging and poor drainage.",
      nutrientProfile: [
        "Very rich in key mineral nutrients like Potassium (K)",
        "Moderate to high Phosphorus (P) retention",
        "Holds Calcium and Magnesium strongly",
        "Slow to release nitrogen from organic sources"
      ],
      keyCharacteristics: [
        "Tiny mineral particles with very small pore spaces",
        "Poor aeration; roots can struggle to get oxygen",
        "Expands and gets sticky when wet; shrinks and cracks when dry",
        "Heavy to work, dig, or plow"
      ],
      suitableCrops: [
        {
          name: "Broccoli",
          type: "Vegetable",
          whySuitable: "Broccoli has heavy nutrient demands and strong roots that stabilize perfectly in dense, rich clay.",
          sowingSeason: "Early Spring or Late Summer",
          waterRequirement: "Moderate to High (keeps soil consistently moist)",
          careTips: [
            "Plant on raised beds to improve drainage in rainy periods",
            "Mulch around stems to prevent the clay surface from baking into a hard crust",
            "Feed with liquid organic fertilizer to supplement cold soil periods"
          ]
        },
        {
          name: "Cabbage",
          type: "Vegetable",
          whySuitable: "Cabbage thrives on the steady supply of potassium and heavy water reserves locked in clay soil.",
          sowingSeason: "Spring or Summer (for winter harvest)",
          waterRequirement: "Moderate (needs even moisture for tight heads)",
          careTips: [
            "Apply lime if the soil is too acidic (reduces clubroot disease risks)",
            "Firm the soil firmly around the roots at transplanting",
            "Keep the area clean of fallen debris to prevent slug hiding spots"
          ]
        },
        {
          name: "Apple Trees",
          type: "Fruit",
          whySuitable: "Clay provides solid mechanical support for heavy tree roots and a steady supply of moisture during fruiting.",
          sowingSeason: "Late Winter (dormant bare-root) or Spring",
          waterRequirement: "Moderate (deep roots draw water from deeper clay layers)",
          careTips: [
            "Avoid planting trees in a 'bathtub' pit in heavy clay; build a mound instead",
            "Incorporate compost in a wide, shallow area around the roots",
            "Prune annually in winter to optimize air circulation and sunlight"
          ]
        }
      ],
      soilImprovementTips: [
        "Incorporate organic materials like compost, leaf mold, and gypsum to aggregate clay particles and create larger pore spaces.",
        "Create raised planting beds. This allows gravity to pull excess water away from the upper root zone.",
        "Never till or walk on clay soil when it is wet. Doing so destroys the fragile soil structure and causes severe compaction."
      ],
      funFact: "Clay particles are microscopic—thousands of times smaller than sand grains! Their flat, plate-like shape carries negative electrical charges, which is why clay is so efficient at holding onto positively charged nutrients."
    }
  }
];
