import { useSearchParams } from 'react-router-dom';

/**
 * Works like setSearchParams, but retains existing params and clears any keys with empty values
 * @returns {[URLSearchParams,updateSearchParams]}
 */
export const useUpdateSearchParams = () => {
  const [searchParams, setSearchParams] : [URLSearchParams, Function] = useSearchParams();

  const updateSearchParams = (updates: Record<string, any>): void => {
    setSearchParams((prev: URLSearchParams) : URLSearchParams => {
      const newParams = new URLSearchParams(prev);
      for (const [key, value] of Object.entries(updates)) {
        newParams.set(key, value);
      }
      // clean params
      for (const [key, value] of newParams) {
        if (!value) {
          newParams.delete(key);
        }
      }
      return newParams;
    });
  };

  const clearSearchParams = () => {
    setSearchParams(new URLSearchParams());
  };
  return [searchParams, updateSearchParams, clearSearchParams] as const;
};

export const useFilter = () => {
  const [searchParams, updateSearchParams] = useUpdateSearchParams();
  const filter = searchParams.get('filter') || '';

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || '';

    updateSearchParams({
      filter: value,
      page: 1,
    });
  };

  return { filter, handleFilterChange };
};
