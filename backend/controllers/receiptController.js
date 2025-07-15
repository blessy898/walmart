// 📁 backend/controllers/receiptController.js

import Tesseract from 'tesseract.js';
import fs from 'fs';

// ✅ Step 1: Health analysis based on item category totals
function evaluateHealth(summary) {
  const { Fruits, Vegetables, Snacks } = summary;
  if (Snacks > 3) return '⚠️ Unhealthy Diet - Too many snacks';
  if (Fruits >= 2 && Vegetables >= 2) return '✅ Healthy Diet';
  if (Fruits === 0 || Vegetables === 0) return '⚠️ Low Nutrition';
  return '⚠️ Moderate Diet';
}

// ✅ Step 2: Smart keyword-based categorizer (no AI, still "intelligent")
async function classifyItemsWithAI(items) {
  const categoryPatterns = [
    {
      category: "Fruits",
      keywords: ["fruit", "apple", "banana", "mango", "grape", "orange", "berry", "pineapple", "kiwi", "watermelon"]
    },
    {
      category: "Vegetables",
      keywords: ["veg", "onion", "carrot", "spinach", "broccoli", "tomato", "potato", "greens", "beans", "cabbage"]
    },
    {
      category: "Dairy",
      keywords: ["milk", "cheese", "butter", "curd", "yogurt", "paneer", "cream", "lassi", "ghee"]
    },
    {
      category: "Grains",
      keywords: ["rice", "wheat", "flour", "bread", "oats", "corn", "grain", "maida", "pasta", "cereal", "atta"]
    },
    {
      category: "Snacks",
      keywords: ["chips", "cookie", "biscuit", "snack", "candy", "chocolate", "namkeen", "cracker", "munch", "lays"]
    },
    { category: "Other", keywords: [] }
  ];

  return items.map((item) => {
    const lower = item.toLowerCase();

    for (const { category, keywords } of categoryPatterns) {
      for (const keyword of keywords) {
        if (lower.includes(keyword)) {
          return { item, category };
        }
      }
    }

    return { item, category: "Other" }; // fallback
  });
}

// ✅ Step 3: Main controller function
export const processReceipt = async (req, res) => {
  try {
    const imagePath = req.file.path;

    // Step 1: OCR the image using Tesseract
    const {
      data: { text },
    } = await Tesseract.recognize(imagePath, 'eng');

    // Step 2: Extract clean item lines (ignore prices, totals, etc.)
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && /^[a-zA-Z]/.test(line));

    if (lines.length === 0) {
      throw new Error('No valid items found in the receipt');
    }

    // Step 3: Use the offline smart categorizer
    const items = await classifyItemsWithAI(lines);

    // Step 4: Count items per category
    const summary = {
      Fruits: 0,
      Vegetables: 0,
      Dairy: 0,
      Grains: 0,
      Snacks: 0,
      Other: 0,
    };

    items.forEach(({ category }) => {
      if (summary.hasOwnProperty(category)) {
        summary[category]++;
      } else {
        summary.Other++;
      }
    });

    // Step 5: Evaluate healthiness
    const healthStatus = evaluateHealth(summary);

    // Step 6: Delete the image file
    fs.unlinkSync(imagePath);

    // Step 7: Return final response
    res.json({
      rawText: text,
      categorizedItems: items,
      dietSummary: summary,
      healthEvaluation: healthStatus,
    });

  } catch (err) {
    console.error('❌ OCR processing error:', err.message || err);
    res.status(500).json({ error: 'Failed to process receipt', details: err.message });
  }
};
