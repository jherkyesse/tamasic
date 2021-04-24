export function isElementAtTop(element: HTMLElement) {
  try {
    if (!element) {
      throw new Error('Element is undefined. Please check reference.');
    }
    const { innerHeight } = window;
    const { y } = element.getBoundingClientRect();
    if (y / innerHeight > 0.66) return false;
    return true;
  } catch (error) {
    console.warn(error);
    return true;
  }
}
