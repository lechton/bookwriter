export default function CaptainLine({ name }) {
  return <p>Captain: {name}</p>; // Reads the latest name prop from TeamList on every render
}
