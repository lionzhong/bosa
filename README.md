# bosa
航空机票数据转换器

用于将有一定规律的txt文本旅客数据转换为CSV。转换方式为通过监听原始数据目录变化，找出此目录中的txt文件转换。


### txt中每条数据一行

例如：

txt：<br>
某人 000000000000000000 儿童 13000000000 <br>
FisrtName/LastName 000000000000000000 13000000000

csv：

序号 | 姓名                | 旅客类型 | 证件类型 | 证件号码           | 出生日期 | 手机号
:--  | :----------------: | :------: | :-----: | :---------------: | :-----: | -----------:
1    | 某人               | 儿童     |  身份证  | 000000000000000000 | 1900-01-01 | 13000000000
2    | FisrtName/LastName | 成人     |  护照    | G12345678			|			 | 13000000000


### 配置（config.js）

字段         | 说明 
------------ | ------------- 
originalData | 原始数据存放目录，也是会被监听的目录
compiledData | 转换后的完整JSON数据
csvData      | CSV文件存放目录
originalExt  | 需要被监控的文件后缀，目前只支持txt
