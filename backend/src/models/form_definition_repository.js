const FORM_DEFINITIONS = new Map([
  [
    "profile_form",
    {
      id: "profile_form",
      requiredFields: ["firstName", "lastName", "email"],
      formats: {
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? "")),
        age: (value) => value === undefined || Number.isInteger(value)
      },
      businessRules: [
        {
          code: "AGE_MINIMUM",
          field: "age",
          message: "Age must be at least 18.",
          validate: (payload) => payload.age === undefined || payload.age >= 18
        }
      ]
    }
  ]
]);

export function getFormDefinition(formId) {
  return FORM_DEFINITIONS.get(formId) ?? null;
}
