import { getCurrentUser } from "@/lib/appwrite";
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
        set({ user: user as User  , isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.log("Error fetching authenticated user: ", error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    } finally {
        set({isLoading: false})
    }
  }
}));


export default useAuthStore;