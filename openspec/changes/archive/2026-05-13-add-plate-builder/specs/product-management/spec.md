## MODIFIED Requirements

### Requirement: Admin can configure builder type for a product
The system SHALL provide a `builder_type` selector in the product admin form with three options: `none` (producto estándar sin constructor), `nomenclature` (constructor interactivo de precio por carácter), and `plate` (constructor de placa, precio fijo por unidad). The selector SHALL replace the previous `is_nomenclature` checkbox. When `builder_type === 'nomenclature'` is selected, the companion product selector (`letter_product_id`) SHALL remain visible. When `builder_type === 'plate'` or `builder_type === 'none'` is selected, the companion product selector SHALL be hidden. The form SHALL submit `builder_type` as a form field and the server action SHALL persist it to `products.builder_type`.

#### Scenario: Admin selects nomenclature builder type
- **WHEN** an admin opens the product form and selects "Constructor de nomenclatura (precio por carácter)" in the builder type selector
- **THEN** the companion product selector becomes visible and the form submits `builder_type = 'nomenclature'`

#### Scenario: Admin selects plate builder type
- **WHEN** an admin opens the product form and selects "Constructor de placa (precio fijo)" in the builder type selector
- **THEN** the companion product selector is hidden and the form submits `builder_type = 'plate'`

#### Scenario: Admin selects none builder type
- **WHEN** an admin opens the product form and selects "Ninguno (producto estándar)" in the builder type selector
- **THEN** the companion product selector is hidden and the form submits `builder_type = 'none'`

#### Scenario: Existing nomenclature product loads correctly
- **WHEN** an admin opens the edit form of a product that was previously migrated from `is_nomenclature = true` to `builder_type = 'nomenclature'`
- **THEN** the selector shows "Constructor de nomenclatura" pre-selected and the companion selector is visible with the previously saved `letter_product_id`

---

## ADDED Requirements

### Requirement: Product detail page renders correct builder based on builder_type
The system SHALL render the appropriate interactive component in `ProductDetailClient` based on `product.builder_type`: `'none'` → standard cart button, `'nomenclature'` → `NomenclatureBuilder` component (unchanged behavior), `'plate'` → `PlateBuilder` component.

#### Scenario: Product with builder_type none shows standard button
- **WHEN** a customer visits a product page where `builder_type = 'none'`
- **THEN** a single "Agregar al carrito" button is displayed with no text input

#### Scenario: Product with builder_type nomenclature shows NomenclatureBuilder
- **WHEN** a customer visits a product page where `builder_type = 'nomenclature'`
- **THEN** the `NomenclatureBuilder` component is displayed with per-character pricing

#### Scenario: Product with builder_type plate shows PlateBuilder
- **WHEN** a customer visits a product page where `builder_type = 'plate'`
- **THEN** the `PlateBuilder` component is displayed with fixed unit pricing and a plate text input
