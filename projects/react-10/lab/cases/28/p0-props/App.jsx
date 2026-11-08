function Page({ theme }) {
  return <ShareButton theme={theme} />;
}

function ShareButton({ theme }) {
  return <button className={theme}>Share</button>;
}

export default function App() {
  return <Page theme="dark" />;
}
