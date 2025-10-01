import { supabase } from '../lib/supabase';
import { Database } from '../lib/supabase';

type Rental = Database['public']['Tables']['rentals']['Row'];
type RentalInsert = Database['public']['Tables']['rentals']['Insert'];
type RentalUpdate = Database['public']['Tables']['rentals']['Update'];

export const rentalService = {
  // Create new rental
  async createRental(rental: RentalInsert) {
    const { data, error } = await supabase
      .from('rentals')
      .insert(rental)
      .select(`
        *,
        products (*),
        renter:profiles!renter_id (*),
        host:profiles!host_id (*)
      `)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Get rentals for user (as renter)
  async getRentalsAsRenter(userId: string, status?: string) {
    let query = supabase
      .from('rentals')
      .select(`
        *,
        products (*),
        host:profiles!host_id (
          name,
          avatar_url,
          phone
        )
      `)
      .eq('renter_id', userId);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Get rentals for user (as host)
  async getRentalsAsHost(userId: string, status?: string) {
    let query = supabase
      .from('rentals')
      .select(`
        *,
        products (*),
        renter:profiles!renter_id (
          name,
          avatar_url,
          phone
        )
      `)
      .eq('host_id', userId);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Get single rental
  async getRental(id: string) {
    const { data, error } = await supabase
      .from('rentals')
      .select(`
        *,
        products (*),
        renter:profiles!renter_id (*),
        host:profiles!host_id (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Update rental status
  async updateRental(id: string, updates: RentalUpdate) {
    const { data, error } = await supabase
      .from('rentals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Cancel rental
  async cancelRental(id: string, reason?: string) {
    const { data, error } = await supabase
      .from('rentals')
      .update({
        status: 'cancelled',
        notes: reason,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Get rental statistics for host
  async getHostStats(hostId: string) {
    const { data, error } = await supabase
      .from('rentals')
      .select('status, total_amount, created_at')
      .eq('host_id', hostId);

    if (error) {
      throw new Error(error.message);
    }

    const stats = {
      totalRentals: data.length,
      activeRentals: data.filter(r => r.status === 'active').length,
      completedRentals: data.filter(r => r.status === 'completed').length,
      totalEarnings: data
        .filter(r => r.status === 'completed')
        .reduce((sum, r) => sum + r.total_amount, 0),
      thisMonthEarnings: data
        .filter(r => {
          const rentalDate = new Date(r.created_at);
          const now = new Date();
          return rentalDate.getMonth() === now.getMonth() &&
                 rentalDate.getFullYear() === now.getFullYear() &&
                 r.status === 'completed';
        })
        .reduce((sum, r) => sum + r.total_amount, 0),
    };

    return stats;
  },

  // Check if dates are available for product
  async checkAvailability(productId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('rentals')
      .select('id')
      .eq('product_id', productId)
      .in('status', ['confirmed', 'active'])
      .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);

    if (error) {
      throw new Error(error.message);
    }

    return data.length === 0; // Available if no conflicting rentals
  },
};