import { useState, useEffect } from 'react';

// const initialProxy = (defaultRecord) => new Proxy(defaultRecord, {
// 	get: (target) => target[Math.max(0, target?.recordList?.length - 1)],
// 	set: (target, prop, receiver) => {
// 	},
// });


function useRecord(defaultRecord = [], defaultRecordIndex = 0) {
	const [recordIndex, setRecordIndex] = useState(defaultRecordIndex);
	const [recordList, setRecordList] = useState(defaultRecord);
  return [recordList[recordIndex - 1], recordList[recordIndex], setRecordIndex];
}

export default useRecord;
