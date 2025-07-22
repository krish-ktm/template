import { supabase } from './supabase';
import { User, LoginCredentials } from '../types';
import bcrypt from 'bcryptjs';

export async function login({ email, password }: LoginCredentials): Promise<{ user: User | null; error: string | null }> {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('status', 'active')
      .single();

    if (error) throw new Error('Invalid credentials');
    if (!users) throw new Error('User not found');

    const isValidPassword = await bcrypt.compare(password, users.password);
    if (!isValidPassword) throw new Error('Invalid credentials');

    // Update last login
    const { error: updateError } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', users.id);

    if (updateError) {
      console.error('Error updating last login:', updateError);
    }

    const user: User = {
      id: users.id,
      email: users.email,
      role: users.role,
      name: users.name,
      created_at: users.created_at,
      last_login: users.last_login,
      status: users.status
    };

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

export async function getUsers(): Promise<{ users: User[]; error: string | null }> {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('Authentication required');
    }

    const currentUser = JSON.parse(userStr) as User;
    if (currentUser.role !== 'superadmin') {
      throw new Error('Unauthorized access');
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, role, name, created_at, last_login, status')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return { users: users as User[], error: null };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { users: [], error: error.message };
  }
}

export async function createUser(userData: Partial<User> & { password: string }): Promise<{ user: User | null; error: string | null }> {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        ...userData,
        password: hashedPassword
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    const user: User = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      created_at: newUser.created_at,
      last_login: newUser.last_login,
      status: newUser.status
    };

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

export async function updateUser(
  id: string, 
  userData: Partial<User> & { password?: string }
): Promise<{ success: boolean; error: string | null }> {
  try {
    const updateData: Record<string, any> = { ...userData };
    
    // If password is provided, hash it
    if (userData.password) {
      updateData.password = await bcrypt.hash(userData.password, 10);
    }
    
    // Remove password from userData if it's empty
    if (updateData.password === '') {
      delete updateData.password;
    }

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteUser(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Check if the current user has superadmin privileges
 * @returns An object with isAuthorized flag and optional error message
 */
export const checkSuperAdminAccess = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return { 
        isAuthorized: false, 
        error: 'Authentication required' 
      };
    }

    const user = JSON.parse(userStr);
    if (user.role !== 'superadmin') {
      return { 
        isAuthorized: false, 
        error: 'You do not have permission to access this page' 
      };
    }

    return { isAuthorized: true };
  } catch (error) {
    console.error('Error checking admin access:', error);
    return { 
      isAuthorized: false, 
      error: 'An error occurred while verifying your access' 
    };
  }
};

/**
 * Check if the current user has receptionist role and is on an allowed route
 * @returns An object with isAuthorized flag and optional error message
 */
export const checkReceptionistAccess = (currentPath: string) => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return { 
        isAuthorized: false, 
        error: 'Authentication required' 
      };
    }

    const user = JSON.parse(userStr);
    
    // If superadmin, they have access to everything
    if (user.role === 'superadmin') {
      return { isAuthorized: true };
    }
    
    // If receptionist, check allowed routes
    if (user.role === 'receptionist') {
      // Specifically redirect from dashboard to appointments
      if (currentPath === '/admin') {
        return {
          isAuthorized: false,
          redirectTo: '/admin/appointments'
        };
      }
      
      // Check other allowed routes
      const allowedRoutes = ['/admin/appointments', '/admin/mr-appointments'];
      const isAllowed = allowedRoutes.some(route => currentPath === route);
      
      if (!isAllowed) {
        return {
          isAuthorized: false,
          error: 'You do not have permission to access this page',
          redirectTo: '/admin/appointments'
        };
      }
      
      return { isAuthorized: true };
    }
    
    // If any other role
    return { 
      isAuthorized: false, 
      error: 'Unauthorized role' 
    };
  } catch (error) {
    console.error('Error checking receptionist access:', error);
    return { 
      isAuthorized: false, 
      error: 'An error occurred while verifying your access' 
    };
  }
};