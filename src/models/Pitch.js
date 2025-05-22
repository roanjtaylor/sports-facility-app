export class Pitch {
  constructor(data = {}) {
    this.id = data.id || null;
    this.facilityId = data.facility_id || '';
    this.name = data.name || '';
    this.configuration = data.configuration || {};
    this.createdAt = data.created_at ? new Date(data.created_at) : new Date();
  }

  getPlayerSizes() {
    return this.configuration.playerSizes || [];
  }

  supports5Aside() {
    return this.getPlayerSizes().includes('5-aside');
  }

  supports11Aside() {
    return this.getPlayerSizes().includes('11-aside');
  }
}
