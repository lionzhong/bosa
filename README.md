# bosa
航空机票数据转换器

用于将有一定规律的txt文本旅客数据转换为CSV

txt中每条数据一行

例如：

txt：
某人 000000000000000000 儿童 13000000000 <br>
FisrtName/LastName 000000000000000000 13000000000

csv：
序号	姓名	               旅客类型	证件类型	证件号码	           出生日期	   手机号
1	    某人                儿童	   身份证	  000000000000000000	1964-03-28	13000000000 <br>
2	    FisrtName/LastName	成人	   护照  	  G12345678	                     	 13000000000


First Header | Second Header | Third Header
:----------- | :-----------: | -----------:
Left         | Center        | Right
Left         | Center        | Right
