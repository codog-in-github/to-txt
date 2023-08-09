const { dialog } = require('electron');
const xlsx = require('node-xlsx');
const fs = require('fs');
const { resolve } = require('path');
const { templateDir } = require('./filePath');
const path = require('path');
/**
 * 格式化日期对象  YYYYMMDD 格式
 * @param {Date} d Date
 * @returns {string}
 */
function formateDate(d) {
  return d.getFullYear() +
  (d.getMonth() + 1).toString().padStart(2, '0') +
  (d.getDate()).toString().padStart(2, '0');
}
 
/**
 * 获取单元格值
 * @param {Array<Array<string|number>>} sheet 工作表数据
 * @param {string} index 单元格地址
 * @returns {string}
 */
function getCellVal (sheet, index) {
  const [, i, j] = /([A-Z]+)(\d+)/.exec(index);
  let val = sheet[j - 1]?.[en2i(i)]
  return val || val === 0 ? val : ''
}

const methods = {
  date (val) {
    return formateDate(
      new Date(((val - 70 * 365 - 19) * 86400 - 8 * 3600) * 1000)
    );
  },
  slice (val, start, end) {
    return val.slice(start, end);
  },
  replace (val, from, to) {
    return val.replace(from, to);
  },
  or (val, ...indexs) {
    if(val) return val;
    for(const index of indexs) {
      let val = getCellVal(this, index);
      if(val) return val;
    }
    return '';
  },
  toFixed(val, num) {
    if(val) {
      return Number(val).toFixed(num);
    } else {
      return '';
    }
  },
  addUnit (val, unit) {
    if(val) {
      return val + unit;
    } else {
      return '';
    }
  },
  isNotEmpty(val, yes, no = '') {
    return val ? yes : no
  }
};

const constant = {
  today: formateDate(new Date())
};

function en2i(en) {
  const ens = [...en];
  return ens.map(
    (item, i) => 26 ** (ens.length - i - 1) * (item.charCodeAt() - 64)
  ).reduce(
    (prev, curr) => prev + curr, -1
  );
}
/**
 * out put
 * @param {string} tpl template name
 * @param {Object} extra extra data
 */
module.exports = function (tpl, extra) {
  let _constant = { ...constant, ...extra };
  const files = dialog.showOpenDialogSync({
    properties: ['openFile'],
    filters: [
      {name: 'xlx', extensions: ['xlx', 'xlsx']}
    ]
  });
  if(files?.[0]) {
    let data = xlsx.parse(files[0]);
    const tplContent = fs.readFileSync(
      resolve(templateDir, tpl),
    ).toString();
    if (/^!sheet=.+\r?\n/.test(tplContent)) {
      const txtContent = tplContent.replace(/^!sheet=(.+)\r?\n/, function (_, sheetName) {
        data = data.find(item => item.name === sheetName)?.data;
        return '';
      }).replace(/\{\$([a-zA-Z]+)\}/g, function(_, name){
        return _constant[name];
      }).replace(/\{([A-Z]+\d+)(?:\|(?:([a-zA-Z]+)(?:\((.+)\))?))?\}/g, function () {
        const [, index, methodName, argsStr] = arguments;
        let val = getCellVal(data, index);
        if (methodName) {
          const args = [val];
          if(argsStr){
            argsStr.split(',').forEach(val => {
              args.push(
                eval(val)
              );
            });
          }
          return methods[methodName].apply(data, args);
        }
        return val;
      });
      fs.writeFileSync(
        path.resolve(
          path.dirname(files[0]),
          `${data[2]?.[7] ?? 'unknow'}.${tpl.toUpperCase().replace(/\.TXT$/, '')}.txt`
        ),
        txtContent
      );
    }
  }
};