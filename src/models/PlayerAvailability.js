export class PlayerAvailability {
  constructor(data = {}) {
    this.id = data.id || null;
    this.playerId = data.player_id || '';
    this.dayOfWeek = data.day_of_week || 0;
    this.startTime = data.start_time || '';
    this.endTime = data.end_time || '';
    this.createdAt = data.created_at ? new Date(data.created_at) : new Date();
  }

  getDayName() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[this.dayOfWeek] || 'Unknown';
  }
}
