export default function Shuffle(arr) {
  return arr.sort(() => (Math.random() > 0.5 ? 1 : -1))
}
