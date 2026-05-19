export function getOAuthProviderAvailability() {
  return {
    google: Boolean(
      (process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID) &&
        (process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET),
    ),
  };
}
