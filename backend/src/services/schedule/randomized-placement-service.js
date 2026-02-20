function seededRandom(seed) {
  let s = seed ?? 1337;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function randomizedPlacement({ papers, grid, seed }) {
  const rand = seededRandom(seed);
  const shuffled = [...papers]
    .map((paper) => ({ paper, rank: rand() }))
    .sort((a, b) => a.rank - b.rank);

  const slots = [];
  for (const column of grid.columns) {
    for (const slot of column.slots) {
      slots.push({ roomId: column.roomId, slotIndex: slot.slotIndex });
    }
  }

  return shuffled.map((entry, index) => {
    const target = slots[index % slots.length];
    return {
      paperId: entry.paper.paperId,
      roomId: target.roomId,
      slotIndex: target.slotIndex,
      randomRank: entry.rank
    };
  });
}
