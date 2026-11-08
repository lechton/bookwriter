export default function Light({ status = 'on' }) {
  return status === 'on' ? <p>Light is on</p> : <p>Light is off</p>;
}
