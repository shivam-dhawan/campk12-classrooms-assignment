// string to camelCase
export const camalizeString = str => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};

export const camel2title = (camelCase) => camelCase
  .replace(/([A-Z])/g, (match) => ` ${match}`)
  .replace(/^./, (match) => match.toUpperCase());

export const Counter = (counter, type, limit) => {
  if (counter < 10 && type === 'plus')
    return ++counter;
  else if (counter > 1 && type === 'minus')
    return --counter;

  return counter;
};

/*
 * safely gets values from deeply nested object
 * usage: getSafely( () => this.props.data.slot.startTime, "");
 */
export const getSafely = (fn, defaultVal) => {
  try {
    return fn();
  } catch (e) {
    return defaultVal;
  }
};

// filters out key in object not matching array elements
export const filterObj = (arr, obj) => {
  const copyObj = { ...obj };
  for (const key in copyObj)
    if (arr.includes(key) === false)
      delete copyObj[key];


  return copyObj;
};

export const debounce = (func, wait, immediate) => {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export const downloadFile = (url, fileName = 'file') => {
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.pdf`;
  link.dispatchEvent(new MouseEvent('click'));
};

export const downloadFileUsingFileType = (data, fileName = 'file') => {
  const blob = new Blob([data], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${new Date().getTime().toString()}.pdf`;
  link.click();
  // link.dispatchEvent(new MouseEvent("click"));
};

export const isValidURL = str => {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
};

export const modifyNextUrl = url => {
  if (url)
    return url.split('/').slice(5).join('/');
  else
    return null;
};

export const roundTo = (n, digits) => {
  let negative = false;
  if (digits === undefined)
    digits = 0;

  if (n < 0) {
    negative = true;
    n = n * -1;
  }
  const multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  n = (Math.round(n) / multiplicator).toFixed(2);
  if (negative)
    n = (n * -1).toFixed(2);

  return n;
};

export const disableAutoFill = () => {
  try {
    let i;
    const el = document.getElementsByClassName(
      'ant-select-search__field'
    );
    for (i = 0; i < el.length; i++)
      el[i].setAttribute(
        'autocomplete',
        'registration-select'
      );
  } catch (e) {
    console.log(e);
  }
};
