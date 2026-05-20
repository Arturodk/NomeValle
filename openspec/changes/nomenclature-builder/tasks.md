## 1. Database Schema Updates

- [x] 1.1 Create SQL migration to add `is_nomenclature` (boolean) and `letter_product_id` (uuid) to `products` table
- [x] 1.2 Create SQL migration to add `customization` (text) to `order_items` table
- [x] 1.3 Apply SQL migrations to the Supabase database

## 2. Admin Panel Updates

- [x] 2.1 Update `Product` types in frontend to include the new `is_nomenclature` and `letter_product_id` fields
- [x] 2.2 Update `ProductForm.tsx` to add a checkbox for the `is_nomenclature` flag
- [x] 2.3 Update `ProductForm.tsx` to conditionally render a dropdown for `letter_product_id` to link the letter product
- [x] 2.4 Update `formActions.ts` (`upsertProduct`) to parse and persist the new fields in the database

## 3. Nomenclature Builder Component

- [x] 3.1 Create `NomenclatureBuilder.tsx` UI component with text input
- [x] 3.2 Implement regex-based price calculation logic inside `NomenclatureBuilder.tsx` (counting numbers vs letters)
- [x] 3.3 Update `/productos/[id]/page.tsx` to fetch the linked letter product price and render `NomenclatureBuilder` when `is_nomenclature` is true

## 4. Cart & Checkout Integration

- [x] 4.1 Update cart state management (`useCart`) to accept and store `customization` text for composite items
- [x] 4.2 Update Cart slide-over UI to display the customization text alongside the product name
- [x] 4.3 Update Wompi checkout server action to validate and recalculate nomenclature total price securely
- [x] 4.4 Update checkout success logic to persist the `customization` text into the `order_items` table
