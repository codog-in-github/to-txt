# EXCEL 转换TXT

## 模板说明
`!sheet=sheetname`工作表名称 sheetname 放在首行 名称后直接换行不允许有空格

`{A1}`  A1单元格 单元格地址均大写

`{A1|foo}` A1单元格 并且调用 foo 函数

`{A1|foo(1, 2, "3")}` A1单元格 并且调用 foo 函数 参数 1, 2, "3"

`{$a}`常量 a

### 函数
date
>参数  
>无  
>将 excel日期格式的值 转换为 20220101 格式字符串

slice
>参数  
>start {number} 开始  
>end {number} 结束(可选)  
>截取字符串从start 到 end

replace
>参数  
>from {string|regExp} 匹配字符串  
>to {string} 替换字符串  
>将匹配字符串 替换为 目标字符串

or
>参数  
>...indexs {string} 单元格地址 可输入任意数量  
>当前者未空时候替换未后者  
>eg `{A1|or("A2", "A3")}`
  
toFixed
>参数  
>num {number} 小数位数  
>将单元格保留num位小数

### 常量
`today` 今天日期 20010101格式
`input` 输入框内容
