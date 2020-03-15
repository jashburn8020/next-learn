# Getting Started

## Setup

- Install nodeenv
  - `sudo pip install nodeenv`
- Create project directory
- Create new Node.js environment
  - go to project directory
  - `nodeenv -n 12.16.1 env`
  - current Node.js LTS version
- Activate environment
  - `. env/bin/activate`
  - deactivate environment using `deactivate_node`
- Install React and Next
  - `npm init -y`
  - `npm install --save react react-dom next`
  - `mkdir pages`
- Update `package.json`, replace `scripts` with:
  - `"dev": "next",`
  - `"build": "next build",`
  - `"start": "next start"`
- Start the dev server
  - `npm run dev`

# Navigate Between Pages

- Client-side navigation (without page refresh):

```
import Link from 'next/link';
...
  <Link href="/about">
    <a style={linkStyle}>About</a>
  </Link>
```

- Supports Back button; handles `location.history`
- `Link` is just a wrapper component that only accepts `href` and some similar props
  - add props to its child

# Using Shared Components

- Since exported pages are JavaScript modules, we can import other JavaScript components into them as well
- Header component in `<project_dir>/components/Header.js`
- Use Header component:
  - `import Header from '../components/Header';`
  - `<Header />`
- Component directory name can be anything
  - the only special directories are `/pages` and `/public`
- Common Layout component in `<project_dir>/components/MyLayout.js`:

```
const Layout = props => (
  <div style={layoutStyle}>
    <Header />
    {props.children}
  </div>
);
```

- Use Layout component:

```
import Layout from '../components/MyLayout';

<Layout>
  <p>...</p>
</Layout>
```

- Rendering child components
  - if you remove `{props.children}`, the Layout cannot render the content we put inside the `Layout` element
- Other methods of creating a Layout component:
  - Layout as a Higher Order Component
  - Page content as a prop

# Create Dynamic Pages

- Dynamic pages by using query strings
- In `pages/index.js`:

```
const PostLink = props => (
  <li>
    <Link href={`/post?title=${props.title}`}>
      <a>{props.title}</a>
    </Link>
  </li>
);
```

- Data passed to `post` page via query string
- In `pages/post.js`:

```
import { useRouter } from 'next/router';
import Layout from '../components/MyLayout';

const Page = () => {
  const router = useRouter();

  return (
    <Layout>
      <h1>{router.query.title}</h1>
      <p>This is the blog post content.</p>
    </Layout>
  );
};

export default Page;
```

- `router`:
  - `query` object has the query string params
  - is a React Hook - works with functional components
  - see <https://nextjs.org/learn/basics/create-dynamic-pages/use-router>

# Clean URLs with Dynamic Routing

- Dynamic Routing feature allows you to handle dynamic routes in `/pages`
  - works with browser history
- In `pages/p/[id].js`:

```
import { useRouter } from "next/router";
import Layout from "../../components/MyLayout";

export default function Post() {
  const router = useRouter();

  return (
    <Layout>
      <h1>{router.query.id}</h1>
      <p>This is the blog post content.</p>
    </Layout>
  );
}
```

- Handles routes that come after `/p/`
  - handles `/p/hello-nextjs`
  - will not handle `/p/post-1/another`
- `[]` in the page name makes it a dynamic route
  - only the full name
  - does not support `/pages/p/post-[id].js`
- `id` between `[]` is the name of the query param received by the page
- In `pages/dynamic_routing.js`:

```
const PostLink = props => (
  <li>
    <Link href="/p/[id]" as={`/p/${props.id}`}>
      <a>{props.id}</a>
    </Link>
  </li>
);
...
<PostLink id="learn-nextjs" />
```

- In the `<Link>` element
  - `href` prop is the path of the page in the `pages` folder
  - `as` is the URL to show in URL bar of the browser

# Fetching Data for Pages

- Async function called `getInitialProps`
  - standard API to fetch data for pages via a remote data source and pass it as props to our pages
  - can only be added to the default component exported by a page, adding it to any other component won't work
  - needs to work on both server and client; it is called in both environments
- Install [isomorphic-unfetch](https://github.com/developit/unfetch)
  - `npm install --save isomorphic-unfetch`
  - library to fetch data
  - simple implementation of the browser fetch API
  - works both in client and server environments
- In `pages/batman.js`:

```
import fetch from 'isomorphic-unfetch';

const Index = props => (
  ...
    <ul>
      {props.shows.map(show => (
        <li key={show.id}>
          <Link href="/batman/[id]" as={`/batman/${show.id}`}>
            <a>{show.name}</a>
          </Link>
        </li>
      ))}
    </ul>
  ...
);

Index.getInitialProps = async function() {
  const res = await fetch("https://api.tvmaze.com/search/shows?q=batman");
  const data = await res.json();

  console.log(`Show data fetched. Count: ${data.length}`);

  return {
    shows: data.map(entry => entry.show)
  };
};

export default Index;
```

- Reloading the page prints the data count on the server console
  - page rendered on the server, no reason to fetch it again in the client
- In `pages/batman/[id].js`:

```
import Layout from "../../components/MyLayout";
import fetch from "isomorphic-unfetch";

const Post = props => (
  <Layout>
    <h1>{props.show.name}</h1>
    <p>{props.show.summary.replace(/<[/]?[pb]>/g, "")}</p>
    {props.show.image ? <img src={props.show.image.medium} /> : null}
  </Layout>
);

Post.getInitialProps = async function(context) {
  const { id } = context.query;
  const res = await fetch(`https://api.tvmaze.com/shows/${id}`);
  const show = await res.json();

  console.log(`Fetched show: ${show.name}`);

  return { show };
};

export default Post;
```

- `console.log` message
  - clicking on the Batman show title displays message on the browser console
    - link wrapped with the `<Link>` component, the page transition takes place in the browser without making a request to the server
  - visit post page directly, e.g., `http://localhost:3000/batman/481`, displays message in the server console
- See <https://nextjs.org/docs/api-reference/data-fetching/getInitialProps>

# Styling Components

- Styling for a React app:
  - Traditional CSS-file-based styling (including SASS, PostCSS etc)
  - CSS in Js styling
- Issues with CSS-file-based styling - avoid
- CSS in JS - style individual components rather than importing CSS files
  - Next.js comes preloaded with a CSS in JS framework called **styled-jsx**
    - CSS rules have no impact on anything other than the components (not even child components)
- In `pages/index.js`:

```
export default function Blog() {
  return (
    <Layout>
      <h1>My Blog</h1>
      <ul>
        ...
      </ul>
      <style jsx>{`
        h1,
        a {
          font-family: "Arial";
        }
        ...
      `}</style>
    </Layout>
  );
}
```

- We did not write styles directly inside of the style tag
  - it was written inside of a template string (` {``} `)
- Sometimes, we do need to change styles inside of a child component
  - especially true when using markdown with React
  - use global styles: `style jsx global`
- In `pages/p/[id].js`:

```
import Markdown from "react-markdown";
...

export default () => {
  const router = useRouter();

  return (
    <Layout>
      <h1>{router.query.id}</h1>
      <div className="markdown">
        <Markdown
          source={`
This is our blog post.
...
            `}
        />
      </div>
      <style jsx global>{`
        .markdown {
          font-family: "Arial";
        }
        ...
      `}</style>
    </Layout>
  );
};
```

- See:
  - <https://github.com/zeit/styled-jsx>
  - <https://nextjs.org/docs/basic-features/built-in-css-support#css-in-js>

# API Routes

- API Routes are lambdas (a.k.a serverless functions) running on Node
- Every file inside `pages/api` is an API Route
- API routes provide built-in middlewares which parse the incoming `req`, like `req.query`
- Install `swr` (React Hooks library for remote data fetching)
  - `npm install swr`
- In `pages/api/randomQuote.js`:

```
import allQuotes from "../../quotes.json";

export default (req, res) => {
  const { author } = req.query;
  let quotes = allQuotes;

  if (author) {
    quotes = quotes.filter(quote =>
      quote.author.toLowerCase().includes(author.toLowerCase())
    );
  }
  if (!quotes.length) {
    quotes = allQuotes.filter(
      quote => quote.author.toLowerCase() === "unknown"
    );
  }

  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  res.status(200).json(quote);
};
```

- In `pages/random_quote.js`:

```
import { useRouter } from "next/router";
import useSWR from "swr";

function fetcher(url) {
  return fetch(url).then(r => r.json());
}

export default function Index() {
  const { query } = useRouter();
  const { data, error } = useSWR(
    `/api/randomQuote${query.author ? "?author=" + query.author : ""}`,
    fetcher
  );
  // The following line has optional chaining, added in Next.js v9.1.5,
  // is the same as `data && data.author`
  const author = data?.author;
  let quote = data?.quote;

  if (!data) quote = "Loading...";
  if (error) quote = "Failed to fetch the quote.";

  return (
    <main className="center">
      <div className="quote">{quote}</div>
      {author && <span className="author">- {author}</span>}

      <style jsx>{`
        ...
      `}</style>
    </main>
  );
}

```

- See <https://nextjs.org/docs/api-routes/api-middlewares>

# Deploying a Next.js App

- In `package.json`:

```
"scripts": {
  "dev": "next",
  "build": "next build",
  "start": "next start"
}
```

- Build for production: `npm run build`
- Start app: `npm run start`
- To run multiple instances
  - in `package.json`, `"start": "next start -p $PORT"`
  - start:
    - `PORT=8000 npm start`
    - `PORT=9000 npm start`

# Troubleshooting

- Page updates not reflected automatically, and you get `Watchpack Error (watcher): Error: ENOSPC: System limit for number of file watchers reached, watch '<directory>'` on the console
  - system limit on the number of files you can monitor has been exceeded
  - fix:
    - `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf`
    - `sudo sysctl -p`

# Sources

- "Virtual environment for Node.js & integrator with virtualenv." <https://github.com/ekalinin/nodeenv>.
- "Learn - Getting Started." <https://nextjs.org/learn/basics/getting-started>.
- "Learn - Navigate Between Pages." <https://nextjs.org/learn/basics/navigate-between-pages>.
- "Learn - Using Shared Components." <https://nextjs.org/learn/basics/using-shared-components>.
- "Learn - Create Dynamic Pages." <https://nextjs.org/learn/basics/using-shared-components>.
- "Learn - Clean URLs with Dynamic Routing." <https://nextjs.org/learn/basics/clean-urls-with-dynamic-routing>.
- "Learn - Fetching Data for Pages." <https://nextjs.org/learn/basics/fetching-data-for-pages>.
- "Learn - Styling Components." <https://nextjs.org/learn/basics/styling-components>.
- "Learn - API Routes." <https://nextjs.org/learn/basics/api-routes>.
- "Learn - Deploying a Next.js App." <https://nextjs.org/learn/basics/deploying-a-nextjs-app>.
- "Increasing the amount of inotify watchers." <https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers>.
