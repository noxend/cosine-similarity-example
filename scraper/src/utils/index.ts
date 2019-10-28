export default {
  getDiffTimeByTimestamp(start: number, end: number, k: number = 1): string {
    const timeDiff = (end - start) * k;

    let msDiff = timeDiff;
    let secDiff = Math.floor(timeDiff / 1000);
    let minDiff = Math.floor(timeDiff / (60 * 1000));
    let hourDiff = Math.floor(timeDiff / (60 * 60 * 1000));

    if (minDiff >= 60) minDiff = minDiff % 60;
    if (hourDiff >= 24) hourDiff = hourDiff % 24;
    if (secDiff >= 60) secDiff = secDiff % 60;
    if (msDiff >= 1000) msDiff = msDiff % 1000;

    return `${hourDiff ? hourDiff + '[Hour(s)] ' : ''}${minDiff ? minDiff + '[Min] ' : ''}${
      secDiff ? secDiff + '[Sec] ' : ''
    }${msDiff ? msDiff + '[Ms]' : ''}`;
  },
  uniqueArray(array: Array<any>) {
    return array.filter((item, i, ar) => ar.indexOf(item) === i);
  }
};
