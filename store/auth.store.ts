import { getCurrentUser, updateUser as updateUserAPI, updateUserEmail as updateUserEmailAPI, signOut } from "@/lib/appwrite";
import { User } from "@/type";
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;

  setIsAuthenticated: (value: boolean) => void;
  setUser: (value: User | null) => void;
  setIsLoading: (value: boolean) => void;

  fetchAuthenticatedUser: () => Promise<void>;
  updateUser: (updates: { name?: string }) => Promise<void>;
  updateUserEmail: (newEmail: string, currentPassword: string) => Promise<void>;
  logout: () => Promise<void>;
};

 const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (value) => set({ user: value }),
  setIsLoading: (value) => set({ isLoading: value }),

  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });
    try {
      const user = await getCurrentUser();
      if (user) {
        set({ user: user as unknown as User, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.log("Error fetching authenticated user: ", error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    } finally {
        set({isLoading: false})
    }
  },

  updateUser: async (updates) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      throw new Error("No authenticated user");
    }

    try {
      const updatedUser = await updateUserAPI(currentUser.$id, updates);
      set({ user: updatedUser as unknown as User });
    } catch (error) {
      console.log("Error updating user: ", error);
      throw error;
    }
  },

  updateUserEmail: async (newEmail, currentPassword) => {
    try {
      await updateUserEmailAPI(newEmail, currentPassword);
      // Refresh user data after email update
      const updatedUser = await getCurrentUser();
      if (updatedUser) {
        set({ user: updatedUser as unknown as User });
      }
    } catch (error) {
      console.log("Error updating user email: ", error);
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await signOut();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      console.log("Error signing out: ", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));


export default useAuthStore;