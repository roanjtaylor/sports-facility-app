export class Booking {
  constructor(data = {}) {
    this.id = data.id || null;
    this.pitchId = data.pitch_id || '';
    this.bookerId = data.booker_id || '';
    this.bookingDate = data.booking_date ? new Date(data.booking_date) : null;
    this.startTime = data.start_time || '';
    this.endTime = data.end_time || '';
    this.status = data.status || 'pending';
    this.createdAt = data.created_at ? new Date(data.created_at) : new Date();
  }

  isPending() {
    return this.status === 'pending';
  }

  isConfirmed() {
    return this.status === 'confirmed';
  }

  isRejected() {
    return this.status === 'rejected';
  }

  isCancelled() {
    return this.status === 'cancelled';
  }

  getFormattedDate() {
    return this.bookingDate ? this.bookingDate.toLocaleDateString() : '';
  }
}
