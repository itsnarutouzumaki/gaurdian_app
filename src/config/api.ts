import schoolConfig from "../../../shared/school-config.json";

// Keep this as the origin; buildApiUrl adds /api/v1 to every API request.
export const API_BASE_URL = schoolConfig.apiBaseUrl;
export const API_VERSION_PATH = "/api/v1";
export const SCHOOL_CODE = schoolConfig.tenantCode;
export const GET_CACHE_TTL_MS = 10 * 60 * 1000;
export const API_REQUEST_TIMEOUT_MS = 20 * 1000;