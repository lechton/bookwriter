export default function BadgePreview({ firstName }) {
  console.log('BadgePreview renders', JSON.stringify(firstName));
  return (
    <>
      <p>Hello, my name is</p>
      <h2>{firstName}</h2>
    </>
  );
}
