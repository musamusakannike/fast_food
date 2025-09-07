import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
  fn: (params: P) => Promise<T>;
  params?: P;
  skip?: boolean;
}

interface UseAppwriteReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams?: P) => Promise<void>;
}

const useAppwrite = <T, P extends Record<string, string | number>>({
  fn,
  params = {} as P,
  skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);
  const paramsRef = useRef<P>(params);

  const fetchData = useCallback(
    async (fetchParams: P) => {
      setLoading(true);
      setError(null);

      try {
        const result = await fn({ ...fetchParams });
        setData(result);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  useEffect(() => {
    if (!skip) {
      fetchData(paramsRef.current);
    }
  }, [fetchData, skip]);

  // Ensure refetch has a stable identity across renders to avoid effects re-triggering
  // in consumers that include `refetch` in dependency arrays.
  const refetch = useCallback(async (newParams?: P) => {
    // Prefer provided params; if none, fall back to the initial params stored in ref.
    const effectiveParams = (newParams ?? paramsRef.current) as P;
    await fetchData(effectiveParams);
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export default useAppwrite;
