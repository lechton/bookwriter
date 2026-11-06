function Person(props) {
  console.log(props.name);
  console.log(props.key);
  return <li>{props.name}</li>;
}

const rowA = <Person key={1} name="Anna" />;

export default function App() {
  return <ul>{rowA}</ul>;
}
