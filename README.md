# Geode Site (v2)

Geode Site. The second version

## Developing

Once you've installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Configuration

The site uses the following (optional) static environment variables:

-   `PUBLIC_API_ENDPOINT`: Base API endpoint for all requests. Current default is "https://api.geode-sdk.org".

-   `PRIVATE_API_ENDPOINT`: API endpoint for requests made from the server, if enabled. This replaces the `PUBLIC_API_ENDPOINT`, so it should follow the same format.

-   `PRIVATE_ENDPOINT_ENABLED`: Enables the `PRIVATE_API_ENDPOINT` option if set to "true". Disabled by default.

nsfm (not safe for mat)
