interface Wishlist {
  name: string
  owner_id: string,
  id?: string,
  description?: string
  is_public?: boolean
  magic_token?: string
  created_at?: string
};

export type {
  Wishlist
};