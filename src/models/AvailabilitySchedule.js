export class AvailabilitySchedule {
  constructor(data = {}) {
    this.id = data.id || null;
    this.pitchId = data.pitch_id || '';
    this.dayOfWeek = data.day_of_week || 0;
    this.startTime = data.start_time || '';
    this.endTime = data.end_time || '';
    this.isPeak = data.is_peak || false;
    this.price = parseFloat(data.price) || 0;
    this.isAvailable = data.is_available !== false;
    this.createdAt = data.created_at ? new Date(data.created_at) : new Date();
  }

  getDayName() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[this.dayOfWeek] || 'Unknown';
  }

  getFormattedPrice() {
    return `£${this.price.toFixed(2)}`;
  }
}
