import { useQuery } from "@tanstack/react-query";

import { listEndpoints } from "@/services/endpointsService";

export function useEndpoints() {
  return useQuery({
    queryKey: ["endpoints"],
    queryFn: listEndpoints,
  });
}
