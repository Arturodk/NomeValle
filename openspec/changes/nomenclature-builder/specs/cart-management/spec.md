## ADDED Requirements

### Requirement: Cart Metadata Support
The system SHALL support and persist custom metadata (such as custom text strings) for items added to the cart, specifically for nomenclature payloads.

#### Scenario: Submitting Cart Items with Metadata
- **WHEN** the nomenclature builder adds an item to the cart context
- **THEN** the cart stores the customization string (e.g., "145-B") along with the composite price

### Requirement: Order Items Customization Persistance
The system SHALL persist the custom nomenclature text into the database `order_items` table during the checkout completion process.

#### Scenario: Checkout Completion
- **WHEN** the user completes a purchase via Wompi
- **THEN** the system saves the nomenclature custom text into the `customization` column of the corresponding row in the `order_items` table
