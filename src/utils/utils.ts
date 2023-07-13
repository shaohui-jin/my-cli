import XLSX from "xlsx";
import { Action, SilderMenuItem, ResponseBlob, ObjectType } from "@/types";
import { message } from "antd";
import { getCookie } from "./cookie";
import { defaultTenantId } from "@/config";

/**
 * 作用：返回对象的类型
 * @param item 被检查的对象
 * return 类型字符串
 */
const isClass: (item: any) => string = (item: any) => {
  return Object.prototype.toString.call(item);
};

/**
 * 作用：深度复制 除了方法以及_proto_，正则不复制 采用递归复制
 * @param item 被复制的对象
 * return 新的对象
 */
export const deepClone = <P>(item: P): P => {
  let result: any = {};
  const _type = isClass(item);

  switch (_type) {
    case "[object Array]":
      result = [];
      break;
    case "[object Object]":
      result = {};
      break;
    default:
      return item;
  }

  for (let key in item) {
    let copy = item[key],
      __type = isClass(copy);
    switch (__type) {
      case "[object Object]":
        result[key] = deepClone(copy);
        break;
      case "[object Array]":
        result[key] = deepClone(copy);
        break;
      default:
        result[key] = item[key];
        break;
    }
  }

  return result;
};

/**
 * desc: 简单的深度克隆，被克隆的对象必须是可以json化
 * @param item 复制的对象
 */
export const simpleClone = <P>(item: P): P => {
  return JSON.parse(JSON.stringify(item));
};

/**
 * 检查是否未定义
 * @param element 被检查的对象
 */
export const checkUndefined = (variable: any): variable is undefined => {
  return typeof variable === "undefined";
};

/**
 * 作用：替换地址中的参数
 * @param params 参数
 * return 新的参数
 */
export const replaceParams = (params: { url: string; data: ObjectType }) => {
  let _params = deepClone(params);
  let isNeedCon: boolean = false; // 是否需要console
  const includes = ["-000001"];

  const tenantId = getCookie("tenantId");
  _params.data.tenantId = _params.data.tenantId || tenantId || defaultTenantId;

  Object.keys(_params.data).forEach(v => {
    if (new RegExp("({" + v + "})").test(_params.url as string)) {
      _params.url = (_params.url as string).replace(RegExp.$1, _params.data[v]);
      delete _params.data[v];
    }

    if (includes.includes(_params.data[v])) {
      !isNeedCon && console.group("===>开始一个请求");
      !isNeedCon && console.log("请求的地址===", _params.url);
      isNeedCon = true;
      console.log("请求的参数===", v);
      delete _params.data[v];
    }
  });

  isNeedCon && console.groupEnd();

  return _params;
};

// desc: 获取租户id
export const getTenantId = () => {
  const tenantId = getCookie("tenantId") || defaultTenantId;
  return tenantId;
}


// desc: 获取time
export const getTime = (startDate: string) => new Date(startDate).getTime();

/**
 * desc: 比较开始时间与结束时间的间隔是否超多*天
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @param days 天数
 */
export const compare = (startDate: string, endDate: string, days: number) => getTime(startDate) - getTime(endDate) >= days * 24 * 3600000;

/**
 * desc: 导出表格的高度 header marginTop paddingTop 条件高度 tableHeaderHeight paginationheight  footer
 * @params {'tableHeight' | 'ordinaryHeight'} 类型
 * @return number
 */
export const getHeight: () => number = () => {
  let cahce: number = 0;
  if (cahce === 0) cahce = document.body.clientHeight - 64 - 15 - 20 - 32 - 54.4 - 64 - 40;
  return cahce;
};

/**
 * desc: 获取值
 * @param {any[][]} data 数据
 * @param {number} i 一级下标 这个可以自减
 * @param {number} j 二级下标 这个不允许自减
 */
const getValue: (data: any[][], i: number, j: number) => any = (data, i, j) => (data[i][j] ? data[i][j] : getValue(data, i - 1, j));

/**
 * desc: 处理excel的data数据
 * @param {data} data 读取excel的数据
 * @param {string[]} keys 关键字
 * @param {number} rows 标题所占的行数
 */
export const handleExcelData: (data: any[][], keys: string[], rows?: number) => any[] = (data, keys, rows = 2) => {
  for (let i = 0; i < rows; i++) {
    // 删除无用的头部
    data.shift();
  }

  let result = data.map((item, index) => {
    let newItem: { [T: string]: any } = {};
    for (let j = 0, len = item.length; j < len; j++) {
      if (data[index]) {
        newItem[keys[j]] = getValue(data, index, j);
      }
    }
    return newItem;
  });

  return result;
};

/**
 * desc:防抖函数实现
 * @param callback 回调函数
 * @param interval 间隔时间
 * @param isImmediate 是否第一次执行
 */
export const debounce = (callback: (...rest: any) => void, interval: number = 500, isImmediate: boolean = true): ((this: any, ...rest: any[]) => boolean) => {
  let timer: null | NodeJS.Timeout = null;

  return function (this: any, ...rest: any[]) {
    if (isImmediate) {
      callback.apply(this, rest);
      isImmediate = false;
      return false;
    }

    timer && clearTimeout(timer as NodeJS.Timeout);

    timer = setTimeout(() => {
      callback.apply(this, rest);
      clearTimeout(timer as NodeJS.Timeout);
      timer = null;
    }, interval);
    return false;
  };
};

/**
 * 节流函数
 * @param callback 回调函数
 * @param interval 时间
 * @param isImmediate 是否是立即执行
 */
export const throttle = (callback: (...rest: any) => void, interval: number = 500): ((this: any, ...rest: any[]) => void) => {
  let oldTime: number = 0;
  // 节流
  return function (this: any, ...rest: any[]) {
    let newTime: number = new Date().getTime();

    if (newTime - oldTime > interval) {
      oldTime = newTime;
      callback.apply(this, rest);
    }
  };
};

/**
 * desc: 返回侧边栏跟treeData数据
 * @param list 角色
 */
export const getMenu = (list: Action[]) => {
  return list
    .sort((a, b) => a.serialNum - b.serialNum)
    .map<SilderMenuItem>(item => {
      let newSider: SilderMenuItem = {} as any;
      newSider.value = item.actionId;
      newSider.title = item.actionName;
      newSider.actionPath = item.actionPath;
      newSider.children = [];
      if (item.subAction && item.subAction.length > 0) {
        newSider.children = getMenu(item.subAction);
      }
      return newSider;
    });
};

/**
 * desc:name={x}字符串截取x的值
 * @param path 请求头
 * @param name key
 */
export const getQueryString = (path: string, name: string) => {
  var reg = new RegExp("(^|;)" + name + "=([^;]*)(;|$)", "i");
  var r = path.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

/**
 * desc: 处理下载的blob数据
 * @param response 接口返回的数据
 */
export const handleBlob = (response: ResponseBlob) => {
  const filename = getQueryString(response.headers["content-disposition"], "filename");

  var a = document.createElement("a");
  var url2 = window.URL.createObjectURL(response.data);
  a.href = url2;
  //设置文件名称
  a.download = filename as string;
  if (navigator.userAgent.indexOf("Firefox") > 0) {
    // 火狐浏览器
    a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
  } else {
    a.click();
  }
  document.body.appendChild(a);
};

// 判断是否为平年
export const isOrdinaryYear = (y: number) => {
  if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) {
    return false;
  }
  return true;
};

/**
 * desc:计算开始时间跟结束时间是否满足条件
 * @param comStartDate 开始时间
 * @param comEndDate 结束时间
 * @param mouths 月数
 */
export const compareMonths = (comStartDate: string, comEndDate: string, mouths: number) => {
  let endDate = new Date(comEndDate); // 当前时间
  let mouth = endDate.getMonth() + 1;
  let cacheMouth = mouth - mouths;
  let newMonth = cacheMouth > 0 ? cacheMouth : cacheMouth + 12;
  let year = endDate.getFullYear() + (cacheMouth > 0 ? 0 : -1);
  let day = endDate.getDate();
  if (newMonth === 2 && day >= 28) {
    day = isOrdinaryYear(year) ? 28 : 29;
  }
  // 小月
  if ([4, 6, 9, 11].includes(newMonth) && day === 31) {
    day = 30;
  }
  let oldDate = new Date(year + "-" + newMonth + "-" + day).getTime();
  if (oldDate >= new Date(comStartDate).getTime()) {
    message.error(`导出最多支持导出${mouths}个月的数据，请重新选择日期`);
    return false;
  }
  return true;
};

/**
 * desc: 处理文件
 * @param file 文件
 */
export const checkFile = (file?: File) => {
  if (!file) {
    return false;
  }

  const name = file.name;
  const suffix = name.substr(name.lastIndexOf("."));
  if (".xls" !== suffix && ".xlsx" !== suffix) {
    message.error("选择Excel格式的文件导入！");
    return false;
  }

  return true;
};

/**
 * 读取xlxs文件
 * @param {*} file
 */
export const readExcel = (file: File) => {
  //此处接受的file，为文件上传的file
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    //以二进制方式读取文件
    reader.readAsBinaryString(file);
    reader.onload = (e: ProgressEvent<FileReader>) => {
      //获取文件数据
      const data = e?.target?.result; //e.target.value
      //XLSX读取文件
      const wb = XLSX.read(data, { type: "binary" });
      //获取第一张表
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      resolve(
        XLSX.utils.sheet_to_json<any[]>(ws, { header: 1 })
      );
    };

    reader.onerror = e => {
      reject(e);
    };
  });
};

/**
 * desc: 文件转base64
 * @param file 文件
 */
export function getBase64(file: File): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => {
      console.group("===file转base64失败===");
      console.log("name====getBase64");
      console.log("file====", file);
      console.log("error====", error);
      console.groupEnd;
    };
  });
}

// true代表开始时间+天数 不大于endDate 也就是无效
export const complate = (startDate: string, days: number, endDate = new Date()) => {
  return getRestDays(startDate, days, endDate) >= 0;
};

// 获取剩余 非整数
export const getRestDays = (startDate: string, days: number, endDate = new Date()) => {
  return (endDate.getTime() - (new Date(startDate + " 00:00:00").getTime() + days * 24 * 60 * 60 * 1000)) / 60 / 60 / 24 / 1000;
};


/**
 * desc: 格式化时间
 * @param {number/Date} time 时间
 * @param {string} fmt 格式
 */
export function format(time, fmt) {
  time = typeof time === "number" ? new Date(time) : time;

  var o = {
    "M+": time.getMonth() + 1, //月份
    "d+": time.getDate(), //日
    "h+": time.getHours(), //小时
    "m+": time.getMinutes(), //分
    "s+": time.getSeconds(), //秒
    "q+": Math.floor((time.getMonth() + 3) / 3), //季度
    S: time.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (time.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
}