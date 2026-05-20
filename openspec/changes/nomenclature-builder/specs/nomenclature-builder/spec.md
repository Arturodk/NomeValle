## ADDED Requirements

### Requirement: Interactive Nomenclature Builder
The system SHALL display an interactive text input instead of a traditional quantity selector on product detail pages when the product is flagged as `is_nomenclature`.

#### Scenario: Display Builder on Nomenclature Product
- **WHEN** user visits a product page where `is_nomenclature` is true
- **THEN** system replaces the standard quantity selector with a text input field for the nomenclature text

### Requirement: Real-time Price Calculation
The system SHALL scan the nomenclature text input in real-time, calculate the price based on character types (numbers vs letters), and display the breakdown to the user.

#### Scenario: Calculation of Numbers and Letters
- **WHEN** user types "145-B" in the builder
- **THEN** system counts 3 numbers and 1 letter, ignores hyphens/spaces, and displays the total price calculation using the base product price for numbers and the `letter_product_id` price for letters

### Requirement: Add Nomenclature to Cart
The system SHALL group the nomenclature as a single composite item in the shopping cart, rather than separate loose items, saving the custom text as metadata.

#### Scenario: Submitting the Custom Nomenclature
- **WHEN** user clicks "Añadir al Carrito" in the builder
- **THEN** system adds a single item to the cart with the text "145-B" as metadata and the total calculated price
