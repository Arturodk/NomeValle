## MODIFIED Requirements

### Requirement: Admin can configure builder type for a product
The system SHALL provide a `builder_type` selector in the product admin form. The previous options (`none`, `nomenclature`, `plate`) SHALL be expanded to include `family_plate` ("Constructor de placa familiar"). The form SHALL submit `builder_type` as a form field and the server action SHALL persist it to `products.builder_type`.

#### Scenario: Admin selects family plate builder type
- **WHEN** an admin opens the product form and selects "Constructor de placa familiar" in the builder type selector
- **THEN** the companion product selector is hidden and the form submits `builder_type = 'family_plate'`

---

## ADDED Requirements

### Requirement: Product detail page renders correct builder based on builder_type
The system SHALL render the appropriate interactive component in `ProductDetailClient` based on `product.builder_type`. A value of `'family_plate'` SHALL render the `FamilyPlateBuilder` component.

#### Scenario: Product with builder_type family_plate shows FamilyPlateBuilder
- **WHEN** a customer visits a product page where `builder_type = 'family_plate'`
- **THEN** the `FamilyPlateBuilder` component is displayed with the custom text and nomenclature options
