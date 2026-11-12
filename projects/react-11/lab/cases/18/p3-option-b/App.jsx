function Person(props) {
  console.log(props.name);
  console.log(props.id);
  return <li id={'person-' + props.id}>{props.name}</li>;
}

const rowB = <Person key={1} id={1} name="Anna" />;

export default function App() {
  return <ul>{rowB}</ul>;
}
