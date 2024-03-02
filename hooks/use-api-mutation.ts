import { useMutation } from "convex/react";
import { useState } from "react";

export const useApiMutation = (mutation: any) => {
  const [pending, setPending] = useState(false);
  const apiMutation = useMutation(mutation);

  const mutate = (payload: any) => {
    setPending(true);
    return apiMutation(payload)
    .finally(() => setPending(false))
    .then((result)=>{
        return result;
    })
    .catch((error)=>{
        throw error;
    });
  };

  return{
    mutate,pending
  }
};
