export default class Salon {
  constructor({
    salon_id,
    owner_email,
    name,
    password,
    type,
    description,
    address,
    phone,
    logo_url,
    created_at,
  }) {
    this.salon_id = salon_id;
    this.owner_email = owner_email;
    this.name = name;
    this.password = password;
    this.type = type;
    this.description = description;
    this.address = address;
    this.phone = phone;
    this.logo_url = logo_url;
    this.created_at = new Date(created_at);
  }

  get shortAddress() {
    return this.address?.split(",")[0] || "No address";
  }

  get formattedDate() {
    return this.created_at.toLocaleDateString();
  }
}
