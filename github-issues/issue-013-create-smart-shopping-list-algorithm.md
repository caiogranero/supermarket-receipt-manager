# Issue #13: Create Smart Shopping List Generation Algorithm

**Status:** OPEN
**Created:** 2025-09-14T17:29:40Z
**Updated:** 2025-09-14T17:29:40Z
**Author:** caiogranero
**Comments:** 0

## Labels
- phase-4
- backend
- feature
- priority-high
- size-l

## Description
Implement the core smart shopping list generation algorithm that analyzes purchase patterns to create intelligent shopping recommendations - the primary value feature of the SuperMarket Receipt Manager.

## Acceptance Criteria
- [ ] Generate shopping lists based on purchase frequency patterns
- [ ] Consider time since last purchase for each item
- [ ] Account for seasonal variations in purchases
- [ ] Prioritize items not bought in 2+ weeks
- [ ] Handle different categories with different frequency patterns
- [ ] Allow manual additions and edits to generated lists
- [ ] Provide confidence scores for recommendations

## Primary Goal Achievement
**Core Problem**: "Never forget what to buy - avoid going to supermarket without knowing usual purchases"

**Algorithm Objectives**:
- Identify items typically purchased weekly/bi-weekly
- Flag items that haven't been bought recently
- Suggest quantities based on historical patterns
- Distinguish between staples and occasional purchases

## Technical Requirements
- **Data Analysis**: Analyze historical purchase data for patterns
- **Frequency Calculation**: Calculate purchase frequency per item
- **Time-based Logic**: Factor in days since last purchase
- **Category Awareness**: Different logic for different item categories
- **Performance**: Fast generation for ~50-100 unique items

## Algorithm Logic
```csharp
public class ShoppingListRecommendation
{
    // Items not purchased in 2+ weeks with historical frequency
    public List<RecommendedItem> HighPriorityItems { get; set; }

    // Items approaching typical repurchase time
    public List<RecommendedItem> MediumPriorityItems { get; set; }

    // Seasonal or occasional items
    public List<RecommendedItem> LowPriorityItems { get; set; }
}

public class RecommendedItem
{
    public string Name { get; set; }
    public int SuggestedQuantity { get; set; }
    public double ConfidenceScore { get; set; } // 0.0 to 1.0
    public int DaysSinceLastPurchase { get; set; }
    public double AverageFrequency { get; set; } // purchases per week
    public string Category { get; set; }
}
```

## Frequency Analysis Patterns
- **Weekly Staples**: Milk, bread, eggs (purchase every 7-10 days)
- **Bi-weekly Items**: Cleaning supplies, frozen foods (every 14-21 days)
- **Monthly Items**: Bulk purchases, non-perishables (every 30+ days)
- **Seasonal Items**: Holiday foods, summer/winter preferences
- **Irregular Items**: Special occasions, new products

## Smart Features
- **Learning**: Algorithm improves with more data
- **Seasonality**: Detect seasonal purchase patterns
- **Quantity Intelligence**: Suggest quantities based on household consumption
- **Store Optimization**: Consider which stores typically sell which items
- **Price Awareness**: Factor in price trends when suggesting timing

## User Experience
- **Primary View**: "Items you likely need" sorted by priority
- **Secondary Views**: "Items to consider", "Seasonal suggestions"
- **Interaction**: Easy to add/remove items, adjust quantities
- **Feedback Loop**: Learn from user modifications to improve suggestions

## Validation
- [ ] Correctly identifies weekly staples from purchase history
- [ ] Flags items not bought in 2+ weeks appropriately
- [ ] Provides reasonable quantity suggestions
- [ ] Algorithm improves with more historical data
- [ ] Performance acceptable for real-time list generation
- [ ] User testing confirms usefulness of recommendations

## Dependencies
- Issue #13: Purchase history search functionality
- Issue #14: Item unification for accurate frequency analysis
- Issue #16: Purchase frequency analysis engine

## Definition of Done
- [ ] Smart shopping list algorithm implemented and tested
- [ ] Generates useful recommendations based on purchase patterns
- [ ] Algorithm performance suitable for real-time use
- [ ] Ready for integration with frontend shopping list interface
- [ ] Solves the core problem: never forget what to buy