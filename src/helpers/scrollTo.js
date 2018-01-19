const easeInOutQuad = (time, b, c, d) => {
  let t = time
  t = t / (d / 2)
  if (t < 1) {
    return c / 2 * t * t + b
  }
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
}

export default function scrollTo ({
  element = document.body,
  to,
  duration = 300,
  left = false,
}) {
  // Need to check if it's a container or element since they operate differently with the scroll and scroll position
  const isContainer = document.body !== element

  let start

  if (isContainer) {
    start = left ? element.scrollLeft : element.scrollTop
  } else {
    document.body.style.pointerEvents = 'none'
    document.body.style.willChange = 'scroll-position'

    // Don't support left scroll for body, don't really see the need for it
    start = left
      ? window.pageXOffset ||
        document.body.scrollLeft ||
        document.documentElement.scrollLeft
      : window.pageYOffset ||
        document.body.scrollTop ||
        document.documentElement.scrollTop

    setTimeout(() => {
      document.body.style.pointerEvents = 'auto'
      document.body.style.willChange = 'auto'
    }, duration + 10)
  }

  const change = to - start
  const increment = 20
  let currentTime = 0

  const animateScroll = () => {
    currentTime += increment

    const val = easeInOutQuad(currentTime, start, change, duration)

    if (isContainer) {
      if (left) {
        element.scrollLeft = val
      } else {
        element.scrollTop = val
      }
    } else {
      if (left) {
        window.scrollTo(val, 0)
      } else {
        window.scrollTo(0, val)
      }
    }

    if (currentTime < duration) {
      setTimeout(animateScroll, increment)
    }
  }

  animateScroll()
}
