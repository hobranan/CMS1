# Data Model - UC-19 Registration Prices

## Entity: PricingAvailabilityState
- Fields:
  - `pricing_set_id` (string, required)
  - `status` (enum: `published`, `unpublished`)
  - `effective_at` (datetime, required)
- Validation rules:
  - Public pricing view allowed only when `status = published`.
  - Unpublished status returns not-available response with no pricing table.

## Entity: RegistrationPriceCategory
- Fields:
  - `category_id` (string, immutable)
  - `pricing_set_id` (string, required)
  - `label` (string, nullable)
  - `condition_text` (string, nullable)
  - `final_amount_cad` (number, required)
  - `currency` (enum: `CAD`)
  - `is_complete` (boolean, required)
- Validation rules:
  - `currency` must be CAD.
  - `final_amount_cad` is the final shown amount with no discount adjustments.
  - Missing label/condition is flagged as incomplete information.

## Entity: PublishedPricingSet
- Fields:
  - `pricing_set_id` (string, immutable)
  - `published_at` (datetime, required)
  - `categories` (array<RegistrationPriceCategory>, required)
- Validation rules:
  - Contains currently authoritative public categories and prices.
  - Guest and authenticated users receive same dataset.

## Entity: PublicPricingViewProjection
- Fields:
  - `pricing_set_id` (string, required)
  - `visible_categories` (array<object>, required)
  - `missing_information_flags` (array<string>, required)
  - `currency_label` (string, required)
- Validation rules:
  - Must render available categories even when subset is missing.
  - Missing/incomplete category details are explicitly indicated.

## Entity: PricingAccessOutcome
- Fields:
  - `request_type` (enum: `view_public_prices`)
  - `outcome` (enum: `success`, `not_available`, `retrieval_error`)
  - `pricing_set_id` (string, nullable)
  - `error_code` (string, nullable)
  - `occurred_at` (datetime, required)

## Relationships
- `PricingAvailabilityState` gates `PublishedPricingSet` visibility.
- `PublishedPricingSet` 1-to-many `RegistrationPriceCategory`.
- `PublicPricingViewProjection` derived from `PublishedPricingSet` and category completeness flags.

## State Transitions
- `unpublished -> published`
  - Trigger: pricing publication in pricing-management workflow.
  - Effects: public pricing view becomes available.
- `published request -> success`
  - Effects: return categories with CAD amounts and missing-info indicators as needed.
- `published request -> retrieval_error`
  - Effects: explicit system error with no pricing content.
- `published -> unpublished` (outside UC-19 lifecycle control)
  - Effects: public requests return not-available message.
