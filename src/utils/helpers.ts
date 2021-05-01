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

export function transformMapToGrid(data: {}): {} {
  return Object.keys(data).reduce((acc, key) => {
    acc = {
      ...acc,
      [key]: {
        value: data[key],
      },
    };
    return acc;
  }, {});
}

export function transformGridData(
  data: { candidate: object; changes: {}[] }[],
) {
  return data.reduce(
    (acc: {}[], item: { candidate: {}; changes: {}[] }, index) => {
      const { candidate, changes = [] } = item;
      const candidateMapData = transformMapToGrid(candidate);

      changes.forEach((change, changeIndex) => {
        acc.push({
          ...(changeIndex === 0 ? candidateMapData : {}),
          ...transformMapToGrid(change),
          row: changes.length - changeIndex,
          order: {
            value: changeIndex === 0 ? index + 1 : '',
          },
        });
      });

      return acc;
    },
    [],
  );
}

export function mapIndex(data: {}[]) {
  return data.map((item, index) => ({
    ...item,
    index,
    // order: {
    //   value: index + 1,
    // },
  }));
}
