export function buildSlotGrid(inputs) {
  const rooms = inputs.rooms;
  const parameters = inputs.parameters;
  const slotMinutes = parameters.slotMinutes ?? 30;
  const totalSlots = parameters.totalSlots ?? 4;
  const startMinute = parameters.startMinute ?? 540;
  const columns = rooms.map((room) => {
    const slots = [];
    for (let i = 0; i < totalSlots; i += 1) {
      slots.push({ slotIndex: i, startMinute: startMinute + i * slotMinutes, endMinute: startMinute + (i + 1) * slotMinutes });
    }
    return { roomId: room.roomId, roomName: room.roomName, slots };
  });
  return { columns, totalSlots, slotMinutes };
}
