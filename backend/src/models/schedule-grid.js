export function buildScheduleGrid({ rooms, parameters }) {
  const slotMinutes = parameters.slotMinutes ?? 30;
  const totalSlots = parameters.totalSlots ?? 4;
  const columns = rooms.map((room) => {
    const slots = [];
    let cursor = parameters.startMinute ?? 540;
    for (let i = 0; i < totalSlots; i += 1) {
      slots.push({
        slotIndex: i,
        startMinute: cursor,
        endMinute: cursor + slotMinutes
      });
      cursor += slotMinutes;
    }
    return { roomId: room.roomId, roomName: room.roomName, slots };
  });
  return { columns, slotMinutes, totalSlots };
}
