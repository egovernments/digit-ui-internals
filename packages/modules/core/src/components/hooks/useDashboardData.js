import { useEffect, useState } from "react";

const useDashboardData = () => {
  const [stats, setStats] = useState({ count: 0, remaining: 0, inbox: 0 });

  useEffect(() => {
    (async () => {
      const tenantId = await Digit.ULBService.getCurrentTenantId();
      let count = await Digit.PGRService.totalCount(tenantId);
      setStats({ ...stats, count: count });
    })();
  }, []);

  return stats;
};

export default useDashboardData;
