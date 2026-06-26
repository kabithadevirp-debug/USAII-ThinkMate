import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

// Flash prevention script — runs before React hydrates
const THEME_SCRIPT = `(function(){var s=localStorage.getItem('thinkmate-theme')||'dark';var r=s;if(s==='system'){r=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',r);})();`;

function NotFoundComponent() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: "0 16px",
      }}
    >
      <div style={{ maxWidth: "400px", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "72px",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1,
          }}
        >
          404
        </h1>
        <h2
          style={{
            marginTop: "16px",
            fontSize: "20px",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          Page not found
        </h2>
        <p
          style={{
            marginTop: "8px",
            fontSize: "14px",
            color: "var(--text-muted)",
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ marginTop: "24px" }}>
          <Link to="/" className="btn-primary">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: "0 16px",
      }}
    >
      <div style={{ maxWidth: "400px", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          This page didn't load
        </h1>
        <p
          style={{
            marginTop: "8px",
            fontSize: "14px",
            color: "var(--text-muted)",
          }}
        >
          Something went wrong on our end. You can try refreshing or head back
          home.
        </p>
        <div
          style={{
            marginTop: "24px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-primary"
          >
            Try again
          </button>
          <a href="/" className="btn-secondary">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "ThinkMate AI — Your Personal Thinking Partner" },
        {
          name: "description",
          content:
            "AI-powered second brain for students, professionals & freelancers.",
        },
        {
          property: "og:title",
          content: "ThinkMate AI — Your Personal Thinking Partner",
        },
        {
          property: "og:description",
          content:
            "AI-powered second brain for students, professionals & freelancers.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "ThinkMate AI — Your Personal Thinking Partner",
        },
        {
          name: "twitter:description",
          content:
            "AI-powered second brain for students, professionals & freelancers.",
        },
        {
          property: "og:image",
          content:
            "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/14aa558a-0301-49f0-a858-4bde3b64a4cb/id-preview-415e2a66--e61f1773-41c6-401a-97c3-d68863f65ea3.lovable.app-1781066945082.png",
        },
        {
          name: "twitter:image",
          content:
            "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/14aa558a-0301-49f0-a858-4bde3b64a4cb/id-preview-415e2a66--e61f1773-41c6-401a-97c3-d68863f65ea3.lovable.app-1781066945082.png",
        },
      ],
      links: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap",
        },
        { rel: "stylesheet", href: appCss },
      ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  },
);

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Flash prevention — must be first in <head> */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { useAuth } from "../lib/auth";
import { initializeFromDB } from "../lib/thinkmate-store";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      initializeFromDB();
    }
  }, [isAuthenticated]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
