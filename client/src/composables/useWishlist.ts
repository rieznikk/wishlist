import { supabase } from '../lib/supabase';
import type { Wishlist, WishlistCreateInput } from '../types/wishlists';

export async function getWishlists(): Promise<Wishlist[]> {
  try {
    const { data, error } = await supabase.from('wishlists').select<'*', Wishlist>();

    if (error) {
      console.error('❌[get-wishlists] - Failed to retrieve wishlists:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('❌[get-wishlists] - Unexpected error:', error);
    return [];
  }
}

export async function createWishlist(wishlistSettings: WishlistCreateInput): Promise<Wishlist | null> {
  try {
    const { data, error } = await supabase.from('wishlists').insert({
      name: wishlistSettings.name,
      owner_id: wishlistSettings.owner_id
    })
    .select()
    .single<Wishlist>();

    if (error) {
      console.error('❌[create-wishlist] - Failed to create a new wishlist:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('❌[create-wishlist] - Unexpected error:', error);
    return null;
  }
}