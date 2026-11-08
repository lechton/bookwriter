const posts = ['New Park Opens', 'Bridge Repaired'];

function Posts({ posts }) {
  return <ul>{posts.map((p) => <li key={p}>{p}</li>)}</ul>;
}

function LayoutWithProp({ posts }) {
  return <section><Posts posts={posts} /></section>;
}

function LayoutWithChildren({ children }) {
  return <section>{children}</section>;
}

export default function App() {
  return (
    <div>
      <LayoutWithProp posts={posts} />
      <LayoutWithChildren><Posts posts={posts} /></LayoutWithChildren>
    </div>
  );
}
