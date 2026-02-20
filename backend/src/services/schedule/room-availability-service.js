export function applyRoomAvailability(rooms) {
  return rooms.filter((room) => room.available !== false);
}
