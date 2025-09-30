import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export function useAuthenticatedQuery(queryKey, queryFn, options = {}) {
  const { logout } = useAuth();

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (error) {
        if (error.response && error.response.status === 401) {
          logout();
        }
        throw error;
      }
    },
    ...options,
  });
}
