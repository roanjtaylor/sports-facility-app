// src/hooks/useSupabase.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { handleDbError } from '../utils/dbHelpers';

/**
 * Custom hook for Supabase queries with loading and error states
 * @param {Function} queryFn - Function that returns a Supabase query
 * @param {Array} dependencies - Dependencies array for useEffect
 * @param {Object} options - Configuration options
 */
export const useSupabaseQuery = (queryFn, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    enabled = true,
    onSuccess = () => {},
    onError = () => {},
    retryOnError = false,
  } = options;

  const executeQuery = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await queryFn();
      setData(result);
      onSuccess(result);
    } catch (err) {
      console.error('Supabase query error:', err);
      setError(err);
      onError(err);

      if (retryOnError) {
        // Retry after 2 seconds
        setTimeout(executeQuery, 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [queryFn, enabled, onSuccess, onError, retryOnError]);

  useEffect(() => {
    executeQuery();
  }, [...dependencies, executeQuery]);

  const refetch = useCallback(() => {
    executeQuery();
  }, [executeQuery]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

/**
 * Custom hook for Supabase mutations with loading and error states
 * @param {Function} mutationFn - Function that performs the mutation
 * @param {Object} options - Configuration options
 */
export const useSupabaseMutation = (mutationFn, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { onSuccess = () => {}, onError = () => {} } = options;

  const mutate = useCallback(
    async variables => {
      try {
        setLoading(true);
        setError(null);

        const result = await mutationFn(variables);
        onSuccess(result, variables);
        return result;
      } catch (err) {
        console.error('Supabase mutation error:', err);
        setError(err);
        onError(err, variables);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    mutate,
    loading,
    error,
    reset,
  };
};

/**
 * Hook for real-time Supabase subscriptions
 * @param {string} table - Table name to subscribe to
 * @param {Function} onInsert - Callback for insert events
 * @param {Function} onUpdate - Callback for update events
 * @param {Function} onDelete - Callback for delete events
 * @param {Object} filter - Filter conditions for subscription
 */
export const useSupabaseSubscription = (
  table,
  { onInsert, onUpdate, onDelete } = {},
  filter = null
) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!table) return;

    let subscription = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          ...(filter && { filter: filter }),
        },
        payload => {
          try {
            switch (payload.eventType) {
              case 'INSERT':
                onInsert?.(payload.new);
                break;
              case 'UPDATE':
                onUpdate?.(payload.new, payload.old);
                break;
              case 'DELETE':
                onDelete?.(payload.old);
                break;
              default:
                console.log('Unknown event type:', payload.eventType);
            }
          } catch (err) {
            console.error('Subscription callback error:', err);
            setError(err);
          }
        }
      )
      .subscribe(status => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          setError(null);
        } else if (status === 'CHANNEL_ERROR') {
          setIsConnected(false);
          setError(new Error('Subscription failed'));
        }
      });

    return () => {
      setIsConnected(false);
      supabase.removeChannel(subscription);
    };
  }, [table, onInsert, onUpdate, onDelete, filter]);

  return { isConnected, error };
};

/**
 * Hook for Supabase storage operations
 * @param {string} bucket - Storage bucket name
 */
export const useSupabaseStorage = bucket => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const upload = useCallback(
    async (file, path, options = {}) => {
      if (!file || !path) {
        throw new Error('File and path are required');
      }

      try {
        setUploading(true);
        setUploadError(null);

        const { data, error } = await supabase.storage.from(bucket).upload(path, file, options);

        if (error) {
          handleDbError(error, 'upload file');
        }

        return data;
      } catch (err) {
        setUploadError(err);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [bucket]
  );

  const remove = useCallback(
    async paths => {
      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .remove(Array.isArray(paths) ? paths : [paths]);

        if (error) {
          handleDbError(error, 'remove file');
        }

        return data;
      } catch (err) {
        console.error('Storage remove error:', err);
        throw err;
      }
    },
    [bucket]
  );

  const getPublicUrl = useCallback(
    path => {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);

      return data?.publicUrl;
    },
    [bucket]
  );

  return {
    upload,
    remove,
    getPublicUrl,
    uploading,
    uploadError,
  };
};
