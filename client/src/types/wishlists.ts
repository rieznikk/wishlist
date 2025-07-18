interface Wishlist {
  name: string
  owner_id: string,
  id: string,
  is_public: boolean
  created_at: string
  description?: string
  magic_token?: string
};

interface WishlistCreateInput {
  name: string;
  owner_id: string;
}

export type {
  Wishlist,
  WishlistCreateInput
};