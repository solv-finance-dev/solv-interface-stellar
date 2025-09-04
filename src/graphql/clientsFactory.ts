import { ApolloClient, InMemoryCache } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';

let sharedClient: ApolloClient | null = null;

export function getGraphqlEndpoint(): string {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL;
  if (!endpoint) {
    throw new Error('Missing NEXT_PUBLIC_GRAPHQL_URL');
  }
  return endpoint;
}

export function getAuthorizationHeader(): string {
  // Temporary placeholder until backend enables auth validation
  // Prefer env override for easy rotation without code changes
  return process.env.NEXT_PUBLIC_GRAPHQL_AUTH || 'solv-app-dev';
}

export function getApolloClient(): ApolloClient {
  if (sharedClient) return sharedClient;

  const httpLink = new HttpLink({
    uri: getGraphqlEndpoint(),
    headers: {
      Authorization: getAuthorizationHeader(),
    },
    fetchOptions: {
      // Ensure CORS preflight covers custom header in browsers
      mode: 'cors',
    },
  });

  sharedClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    // Next.js App Router renders on the server. Our provider is client-side,
    // but keep this safe to hydrate.
    ssrMode: false,
  });

  return sharedClient;
}
