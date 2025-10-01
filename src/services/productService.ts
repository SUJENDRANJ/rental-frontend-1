import { supabase } from '../lib/supabase';
import { Database } from '../lib/supabase';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

export const productService = {
  // Get all products with optional filters
  async getProducts(filters?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    city?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('products')
      .select(`
        *,
        profiles:owner_id (
          id,
          name,
          avatar_url,
          rating:reviews!reviewee_id(rating)
        )
      `);

    if (filters?.category && filters.category !== 'All') {
      query = query.eq('category', filters.category);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters?.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters?.inStock !== undefined) {
      query = query.eq('in_stock', filters.inStock);
    }

    if (filters?.city) {
      query = query.ilike('location_city', `%${filters.city}%`);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Get single product by ID
  async getProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        profiles:owner_id (
          id,
          name,
          avatar_url,
          bio,
          created_at
        ),
        reviews (
          id,
          rating,
          comment,
          created_at,
          profiles:reviewer_id (
            name,
            avatar_url
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Increment view count
    await supabase
      .from('products')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', id);

    return data;
  },

  async createProduct(product: ProductInsert) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Failed to create product');
    }

    return data;
  },

  // Update product
  async updateProduct(id: string, updates: ProductUpdate) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Delete product
  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  },

  // Get products by owner
  async getProductsByOwner(ownerId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Search products
  async searchProducts(query: string, limit = 10) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        profiles:owner_id (
          name,
          avatar_url
        )
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
      .eq('in_stock', true)
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
};