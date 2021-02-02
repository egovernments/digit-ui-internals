export const getLocalityCode = (locality, tenantId) => {
  if (typeof locality === "string") return locality.includes("_") ? locality : `${tenantId.replace(".", "_").toUpperCase()}_ADMIN_${locality}`;
  else if (locality.code) return locality.code.includes("_") ? locality : `${tenantId.replace(".", "_").toUpperCase()}_ADMIN_${locality}`;
};
