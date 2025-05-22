export class Lobby {
  constructor(data = {}) {
    this.id = data.id || null;
    this.creatorId = data.creator_id || '';
    this.pitchId = data.pitch_id || '';
    this.bookingId = data.booking_id || null;
    this.lobbyDate = data.lobby_date ? new Date(data.lobby_date) : null;
    this.startTime = data.start_time || '';
    this.endTime = data.end_time || '';
    this.minPlayers = parseInt(data.min_players) || 0;
    this.maxPlayers = parseInt(data.max_players) || 0;
    this.status = data.status || 'open';
    this.createdAt = data.created_at ? new Date(data.created_at) : new Date();
    this.participants = data.participants || [];
  }

  isOpen() {
    return this.status === 'open';
  }

  isFilled() {
    return this.status === 'filled';
  }

  isCancelled() {
    return this.status === 'cancelled';
  }

  getCurrentPlayerCount() {
    return this.participants.length;
  }

  getSlotsRemaining() {
    return this.maxPlayers - this.getCurrentPlayerCount();
  }

  canAcceptMorePlayers() {
    return this.isOpen() && this.getCurrentPlayerCount() < this.maxPlayers;
  }

  hasMinimumPlayers() {
    return this.getCurrentPlayerCount() >= this.minPlayers;
  }
}
