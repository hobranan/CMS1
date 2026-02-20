import { FormSubmissionRepository } from "../../backend/src/models/form_submission_repository.js";
import { AtomicFormPersistenceService } from "../../backend/src/services/persistence/atomic_form_persistence_service.js";
import { ValidationObservabilityService } from "../../backend/src/services/validation/validation_observability_service.js";
import { createValidationRoutes } from "../../backend/src/api/validation_routes.js";

export function createUc02System() {
  const formSubmissionRepository = new FormSubmissionRepository();
  const atomicPersistence = new AtomicFormPersistenceService(formSubmissionRepository);
  const observability = new ValidationObservabilityService();
  const deps = {
    formSubmissionRepository,
    atomicPersistence,
    observability,
    nowProvider: () => new Date("2026-02-20T00:00:00.000Z")
  };
  const routes = createValidationRoutes(deps);

  return {
    formSubmissionRepository,
    atomicPersistence,
    observability,
    call(routeKey, request = {}) {
      return routes[routeKey](request);
    }
  };
}
