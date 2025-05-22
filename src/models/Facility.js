export class Facility {
  constructor(data = {}) {
    this.id = data.id || null;
    this.ownerId = data.owner_id || '';
    this.name = data.name || '';
    this.address = data.address || '';
    this.photoUrl = data.photo_url || null;
    this.phone = data.phone || null;
    this.isVerified = data.is_verified || false;
    this.createdAt = data.created_at ? new Date(data.created_at) : new Date();
  }
}
