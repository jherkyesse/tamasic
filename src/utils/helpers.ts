import { GridDataProps } from 'components/Grid/index.d';
import { isEqual } from 'lodash';

interface DistinctColumnKeyListType {
  [key: string]: string[];
}

interface DistinctColumnKeyType {
  [key: string]: string;
}

const byRecipeDistinctColumnKeyList: Array<string> = [
  'opeNo',
  'lcRecipeId',
  'stageId',
  'recipeId1',
  'recipeId2',
  'recipeId3',
  'recipeId4',
  'recipeId5',
  'recipeId6',
  'recipeId7',
  'recipeId8',
  'recipeId9',
];

const byRecipeJoinColumnKey: string = 'productId';

const distinctColumnListMap: DistinctColumnKeyListType = {
  recipe: byRecipeDistinctColumnKeyList,
};

const joinColumnKeyMap: DistinctColumnKeyType = {
  recipe: byRecipeJoinColumnKey,
};

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

export function transformDropdownOptions(data: string[]) {
  return data.map((key) => ({
    label: key,
    key,
  }));
}

export function transformMapToGrid(data: { [key: string]: string }): {} {
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

export function addByEditParams(data: {}[]) {
  return data.map((item) => ({
    ...item,
    byGroupEdit: {
      value: false,
    },
    byPartEdit: {
      value: false,
    },
  }));
}

export function transformGridData(data: { candidate: object; changes: {}[] }[]) {
  return data.reduce((acc: {}[], item: { candidate: {}; changes: {}[] }, index) => {
    const { candidate, changes = [] } = item;
    const candidateMapData = transformMapToGrid(candidate);

    changes.forEach((change) => {
      acc.push({
        ...candidateMapData,
        ...transformMapToGrid(change),
        order: {
          value: index + 1,
        },
      });
    });

    return acc;
  }, []);
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

export function mapIndexAndOrder(data: {}[], multiLineKey?: string) {
  return data.map(({ order, ...item }: { order: { value?: number }; [key: string]: any }, index) => ({
    ...item,
    index,
    order: {
      value: index + 1,
    },
    row: multiLineKey ? (item[multiLineKey] || {})?.value?.split(',').length || 1 : 1,
  }));
}

export function mapMultiRow(data: {}[], multiLineKey: string) {
  return data.map((item: { [key: string]: any }) => ({
    ...item,
    multiRow: (item[multiLineKey]?.value || '').split(',').length,
  }));
}

/** Single MultiLine Column */
export function mapRow(data: { [key: string]: any }[]) {
  if (!data.length)
    return [
      {
        order: {
          value: 1,
        },
        index: 0,
        row: 1,
      },
    ];
  const dataRowCountMap = data.reduce(
    (acc: { [key: string]: any }, cur: { multiRow?: number; order?: { value?: number }; row: number }) => {
      const { order, multiRow = 1 } = cur;
      acc[order?.value] = acc[order?.value] ? acc[order?.value] + multiRow : multiRow;
      return acc;
    },
    {},
  );

  return data.map(({ order, ...item }: GridDataProps, index) => ({
    ...item,
    order,
    row: order?.value === data[index - 1]?.order?.value ? 0 : dataRowCountMap[order?.value],
  }));
}

export function selectByType(flowList: GridDataProps[], isSelectByGroup: boolean) {
  const disabledType = isSelectByGroup ? 'byPartEdit' : 'byGroupEdit';
  const availableType = isSelectByGroup ? 'byGroupEdit' : 'byPartEdit';
  return flowList.map((flow) => ({
    ...flow,
    [availableType]: {
      value: flow[availableType].value,
      changeValue: flow[availableType].changeValue,
      isDisabled: false,
    },
    [disabledType]: {
      value: false,
      isDisabled: true,
    },
  }));
}

/** turn order from [9, 10, 13, 13] to [1, 2, 3, 3] */
export function groupByOrder(data: { order: { value: number } }[]) {
  return data.reduce((acc: { index: number; order: { value: number } }[], { order, ...item }, index) => {
    const lastOrderValue = acc[acc.length - 1]?.order.value || 0;
    acc.push({
      ...item,
      index,
      order: {
        value: data[acc.length - 1]?.order?.value === order?.value ? lastOrderValue : lastOrderValue + 1,
      },
    });
    return acc;
  }, []);
}

export function distinctByObject(data: {}[], type = 'recipe') {
  const distinctColumnList = distinctColumnListMap[type];
  const joinColumnKey = joinColumnKeyMap[type];
  if (!distinctColumnList || !joinColumnKey) return data;
  const distinctData = data.reduce(
    (
      acc: {}[],
      cur: {
        index: number;
        opeNo?: { value?: string; changeValue?: string };
        order: { value: number };
        productId?: { value?: string; changeValue?: string };
        row: number;
        [key: string]: any;
      },
    ) => {
      const currentDistinctColumnValueList = distinctColumnList.map((columnKey: string) => cur[columnKey]?.value);
      const isDistinct = acc.some((rowData: {}) => {
        const rowDistinctColumnValueList = distinctColumnList.map((columnKey: string) => rowData[columnKey]?.value);
        const isDistinct = isEqual(rowDistinctColumnValueList, currentDistinctColumnValueList);
        if (isDistinct && rowData[joinColumnKey] && cur[joinColumnKey]) {
          rowData[joinColumnKey].value += `,${cur[joinColumnKey].value}`;
          return true;
        }
        return false;
      });
      if (!isDistinct) acc.push(cur);
      return acc;
    },
    [],
  );
  return mapIndexAndOrder(distinctData as {}[], 'productId');
}

export function splitPart(value: string) {
  return (value || '').split(',');
}

export function distinctByFullPart(data: GridDataProps[], partKey = 'productId'): GridDataProps[] {
  return mapIndexAndOrder(
    data.reduce((acc: GridDataProps[], cur: GridDataProps) => {
      return acc.concat(
        splitPart(cur[partKey]?.value).map((partValue) => ({ ...cur, [partKey]: { value: partValue }, multiRow: 1 })),
      );
    }, []),
  );
}

export function filterExisted(data: {}[], existedKey: string) {
  const existedKeyList: string[] = [];
  return data.reduce((acc: {}[], cur: {}) => {
    const { value } = cur[existedKey] || {};
    if (!existedKeyList.includes(value)) {
      acc.push(cur);
      existedKeyList.push(value);
    }
    return acc;
  }, []) as {}[];
}
