## ADDED Requirements

### Requirement: Interactive Family Plate Builder UI
The system SHALL display a `FamilyPlateBuilder` component on the product detail page when `product.builder_type === 'family_plate'`. This component MUST present the user with a choice for the top plate message and a text input for the bottom nomenclature numbers.

#### Scenario: Customer sees family plate options
- **WHEN** a customer visits a product page for a family plate
- **THEN** they see two radio button options for the top message: "DIOS BENDIGA ESTE HOGAR (Por defecto)" and "Personalizar Apellidos", along with a separate input for the nomenclature text.

### Requirement: Family Name Customization Validation
When the user selects the "Personalizar Apellidos" option, the system SHALL reveal a text input. This input MUST be restricted to a maximum of 25 characters. The add to cart button MUST be disabled if this input is left empty while the custom option is selected.

#### Scenario: User selects custom family name
- **WHEN** a customer selects "Personalizar Apellidos"
- **THEN** an input field appears allowing them to type up to 25 characters. If the field is empty, the submit button is disabled.

### Requirement: Nomenclature Validation for Family Plate
The system SHALL validate the nomenclature text input using the same rules as the standard plate builder: maximum 6 digits, maximum 4 letters, and only alphanumeric characters or hyphens.

#### Scenario: User enters invalid nomenclature
- **WHEN** a customer types "1234567" into the nomenclature field of the family plate
- **THEN** an inline error appears indicating maximum 6 numbers, and the add to cart button is disabled.

### Requirement: Customization String Construction
When adding the product to the cart, the system SHALL construct a single `customization` string that captures both the top plate choice and the nomenclature text.
- If default option: `"Mensaje: DIOS BENDIGA ESTE HOGAR | Nomenclatura: [Nomenclature Text]"`
- If custom option: `"Familia: [Custom Name] | Nomenclatura: [Nomenclature Text]"`

#### Scenario: Customer adds default message plate to cart
- **WHEN** a customer selects the default message option, enters "35-59", and clicks "Agregar al carrito"
- **THEN** a cart item is created with `customization: "Mensaje: DIOS BENDIGA ESTE HOGAR | Nomenclatura: 35-59"`.

#### Scenario: Customer adds custom family plate to cart
- **WHEN** a customer selects the custom option, types "Martínez Vanegas", enters "35-59", and clicks "Agregar al carrito"
- **THEN** a cart item is created with `customization: "Familia: MARTÍNEZ VANEGAS | Nomenclatura: 35-59"`.
