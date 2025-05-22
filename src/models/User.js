export class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || '';
    this.fullName = data.full_name || '';
    this.role = data.role || null;
    this.dateOfBirth = data.date_of_birth ? new Date(data.date_of_birth) : null;
    this.profilePhotoUrl = data.profile_photo_url || null;
    this.createdAt = data.created_at ? new Date(data.created_at) : new Date();
  }

  isFacilityOwner() {
    return this.role === 'facility_owner';
  }

  isPlayer() {
    return this.role === 'player';
  }
}
