export default function getPos (element) {
  let el = element
  let lx, ly

  for (lx = 0, ly = 0;
    el !== null;
    lx += el.offsetLeft,
    ly += el.offsetTop,
    el = el.offsetParent);

  return {
    x: lx,
    y: ly,
  }
}
