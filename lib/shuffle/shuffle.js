export default function Shuffle(arr) {
  // Ensure arr is an array and not null/undefined
  if (!Array.isArray(arr)) {
    console.warn('Shuffle function received non-array input:', arr)
    return []
  }
  return arr.sort(() => (Math.random() > 0.5 ? 1 : -1))
}
