import { createClient } from '@jsr/supabase__supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);

export type Database = {
  ratings: {
    id: string;
    created_at: string;
    day: string;
    date: string;
    vegan: number;
    vegetarian: number;
    meat_fish: number;
    salad: number;
    dessert: number;
    comment: string;
  };
};

