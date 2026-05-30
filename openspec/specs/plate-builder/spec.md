# Plate Builder Specification

## Purpose
Permite a los usuarios personalizar el texto grabado en las placas de sus nomenclaturas con validación en tiempo real y flujo de pedidos múltiples.
## Requirements
### Requirement: Plate text input with format validation
The system SHALL display a `PlateBuilder` component when `product.builder_type === 'plate'`, allowing the customer to enter free text for each plate with real-time format validation. A plate text MUST satisfy all of the following constraints simultaneously: maximum 6 digits, maximum 4 letters, only alphanumeric characters and the hyphen `-` are allowed (no spaces, dots, slashes, or other characters), and minimum length of 1 character.

#### Scenario: Valid plate text is accepted
- **WHEN** a customer types "27-44" into the plate input field
- **THEN** the input shows no error and the "Agregar placa" button becomes enabled

#### Scenario: Exceeding digit limit is rejected
- **WHEN** a customer types a text containing more than 6 digits (e.g., "1234567")
- **THEN** the input shows an inline error "Máximo 6 números" and the add button remains disabled

#### Scenario: Exceeding letter limit is rejected
- **WHEN** a customer types a text containing more than 4 letters (e.g., "ABCDE")
- **THEN** the input shows an inline error "Máximo 4 letras" and the add button remains disabled

#### Scenario: Invalid character is rejected
- **WHEN** a customer types a character that is not alphanumeric or a hyphen (e.g., "27/44" or "27 44")
- **THEN** the input shows an inline error "Solo se permiten números, letras y guion -" and the add button remains disabled

#### Scenario: Empty input cannot be submitted
- **WHEN** the plate input field is empty
- **THEN** the add button remains disabled

---

### Requirement: Multi-plate ordering in a single session
The system SHALL allow a customer to add multiple plates with different texts in a single product page visit. Each plate SHALL be added to the cart as an independent line item (`addItem` call) with `quantity: 1`, `price: product.price`, and `customization: PLATE_TEXT_IN_UPPERCASE`. The `PlateBuilder` component SHALL display a list of plates queued in the current session before confirming addition to cart, and SHALL provide an option to remove any queued plate before submitting.

#### Scenario: Customer adds two different plates
- **WHEN** a customer types "27-44", clicks "Agregar placa", then types "301-B", clicks "Agregar placa", and finally clicks "Confirmar pedido"
- **THEN** two separate items appear in the cart, one with `customization: "27-44"` and one with `customization: "301-B"`, each at the product's unit price

#### Scenario: Customer removes a queued plate
- **WHEN** a customer has queued two plates and clicks the remove button on the first one
- **THEN** only the second plate remains in the queue

#### Scenario: Plate text is stored in uppercase
- **WHEN** a customer types "cra 2" (if valid) or "27-ab"
- **THEN** the stored `customization` value is "27-AB" (uppercased)

---

### Requirement: Fixed price display per plate
The system SHALL display the product's `price` as the cost per plate. The `PlateBuilder` MUST NOT calculate any per-character pricing. The total displayed SHALL be `number_of_queued_plates × product.price`.

#### Scenario: Single plate price display
- **WHEN** a customer has one plate queued and the product price is $85,000
- **THEN** the component shows "Total: $85.000" (1 × $85,000)

#### Scenario: Multiple plates cumulative price
- **WHEN** a customer has three plates queued and the product price is $85,000
- **THEN** the component shows "Total: $255.000" (3 × $85,000)

---

### Requirement: Plate builder disabled when out of stock
The system SHALL disable the plate text input and all action buttons when `product.stock === 0`, mirroring the behavior of the existing `NomenclatureBuilder` disabled prop.

#### Scenario: Out-of-stock product disables builder
- **WHEN** a product with `builder_type = 'plate'` has `stock = 0`
- **THEN** the text input is disabled, the "Agregar placa" button is disabled, and a stock-out indicator is shown

### Requirement: Plate builder micro-interactions
The `PlateBuilder` and `NomenclatureBuilder` components SHALL incorporate premium micro-interactions, including smooth transitions for adding/removing plates from the session queue, and hover physics on the interaction buttons.

#### Scenario: User adds a plate to the queue
- **WHEN** a user clicks "Agregar placa" and the plate is added to the session queue
- **THEN** the new plate item appears in the list with a smooth GSAP or CSS transition

