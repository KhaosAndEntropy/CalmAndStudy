// Set VITE_MAINTENANCE_MODE=true in the build environment to show the pause page.
// Leave it unset or set it to false to serve the full application.
export const MAINTENANCE_MODE = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
