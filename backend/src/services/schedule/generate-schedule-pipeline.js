import { buildSlotGrid } from "./slot-grid-builder.js";
import { randomizedPlacement } from "./randomized-placement-service.js";
import { detectScheduleConflicts } from "./conflict-detection-service.js";

export function generateSchedulePipeline({ acceptedPapers, rooms, parameters, seed }) {
  const grid = buildSlotGrid({ rooms, parameters });
  const placements = randomizedPlacement({ papers: acceptedPapers, grid, seed });
  const conflicts = detectScheduleConflicts({ papers: acceptedPapers, placements });
  return { grid, placements, conflicts };
}
