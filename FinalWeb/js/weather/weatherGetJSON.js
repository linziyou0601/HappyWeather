//--------------------取得36小時天氣資料--------------------
var getTwoDaysData = function(){
    $.getJSON("https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-268DE0E2-66E8-4AE9-A0C3-B06F7EBB5E7A&format=JSON",function(Data){
        Data["records"]["location"].map(function(getCity){
            //宣告暫存陣列
            var Day = [], DayNight = [], Temp = [], Wx = [], Wx_n = [], CI = [], PoP = [];//宣告暫存陣列
            var tmpDay = getCity.weatherElement[0].time[0].endTime.substring(11,16);
            //建立時間、早晚、現象、現象代碼、降雨率、溫度、舒適度陣列
            for(var i = 0; i < 3; i++){
                Day[i] = dayTimeDescript[tmpDay][i][0];
                DayNight[i] = dayTimeDescript[tmpDay][i][1];
                Wx[i] = getCity.weatherElement[0].time[i].parameter.parameterName;
                Wx_n[i] = getCity.weatherElement[0].time[i].parameter.parameterValue;
                Wx_n[i] = Wx_n[i].length == 1 ? '0' + Wx_n[i] : Wx_n[i];
                PoP[i] = getCity.weatherElement[1].time[i].parameter.parameterName + '%';
                Temp[i] = getCity.weatherElement[2].time[i].parameter.parameterName + '°-' + getCity.weatherElement[4].time[i].parameter.parameterName + '°';
                CI[i] = getCity.weatherElement[3].time[i].parameter.parameterName;
            }
            //時間、早晚、現象、現象代碼、降雨率、溫度、舒適度存入物件
            var cityObj = {"Day": Day, "DayNight": DayNight, "Temp": Temp, "Wx": Wx, "Wx_n": Wx_n, "CI": CI, "PoP": PoP};
            //縣市物件存入天氣陣列
            weatherObj[getCity.locationName]["twoDays"] = cityObj;
        });
    });
};

//--------------------取得局屬測站天氣資料及自動測站天氣資料--------------------
var getCurrentData = function(){
    $.getJSON("https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-268DE0E2-66E8-4AE9-A0C3-B06F7EBB5E7A&format=JSON&locationName=%E5%9F%BA%E9%9A%86,%E8%87%BA%E5%8C%97,%E6%9D%BF%E6%A9%8B,%E6%96%B0%E7%AB%B9,%E8%87%BA%E4%B8%AD,%E5%BD%B0%E5%B8%AB%E5%A4%A7,%E5%98%89%E7%BE%A9,%E5%8D%97%E5%8D%80%E4%B8%AD%E5%BF%83,%E9%AB%98%E9%9B%84,%E5%AE%9C%E8%98%AD,%E8%8A%B1%E8%93%AE,%E8%87%BA%E6%9D%B1,%E6%BE%8E%E6%B9%96,%E9%87%91%E9%96%80,%E9%A6%AC%E7%A5%96&elementName=TEMP,HUMD,24R", function(Data){
        pushInWeatherObj(Data);
    });
    $.getJSON("https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=CWB-268DE0E2-66E8-4AE9-A0C3-B06F7EBB5E7A&locationName=%E6%A1%83%E5%9C%92,%E6%96%B0%E7%AB%B9%E5%B8%82%E6%9D%B1%E5%8D%80,%E8%8B%97%E6%A0%97,%E5%8D%97%E6%8A%95,%E6%96%97%E5%85%AD,%E5%A4%AA%E4%BF%9D,%E5%B1%8F%E6%9D%B1&elementName=TEMP,HUMD,H_24R", function(Data){
        pushInWeatherObj(Data);
    });
};
//測站天氣資料存入天氣物件function
var pushInWeatherObj = function (jsonDATA){
    jsonDATA["records"]["location"].map(function(getCity){
        //暫存縣市名稱，並建立測站、縣市、鄉鎮、溫度、濕度、時雨量資料
        var City = getCity["parameter"][0]["parameterValue"];
        weatherObj[City]["locName"] = getCity["locationName"];
        weatherObj[City]["locTown"] = getCity["parameter"][2]["parameterValue"];
        weatherObj[City]["currentTemp"] = (getCity["weatherElement"][0]["elementValue"].substring(0,4) == '-99' ? '未知' : getCity["weatherElement"][0]["elementValue"].substring(0,4)) + '°C';
        weatherObj[City]["currentHUMD"] = getCity["weatherElement"][1]["elementValue"].substring(2) + '%';
        weatherObj[City]["current24R"] = (getCity["weatherElement"][2]["elementValue"] == '-99' ? '0.00' : Number(getCity["weatherElement"][2]["elementValue"]).toFixed(2)) + 'mm';
        weatherObj[City]["currentWx"] = weatherObj[City]["twoDays"]["Wx"][0];
        weatherObj[City]["currentPoP"] = weatherObj[City]["twoDays"]["PoP"][0];
    });
};

//--------------------取得一週天氣資料--------------------
var getWeekData = function(){
    $.getJSON("https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=CWB-268DE0E2-66E8-4AE9-A0C3-B06F7EBB5E7A&format=JSON&elementName=,MinT,MaxT,Wx",function(Data){
        Data["records"]["locations"][0]["location"].map(function(getCity){
            //宣告暫存陣列
            var  Day = [], startIndex;//宣告暫存陣列
            startIndex = getCity.weatherElement[0].time[0].endTime.substring(11,13) == "06" ? 1 : 0;
            //建立一週各時間之現象、現象代碼、溫度陣列
            for(var i = startIndex; i < startIndex + 14; i+=2){
                Day.push({
                    "Date": getCity.weatherElement[0].time[i].startTime.substring(5,10).replace('-','/'),
                    "Day": {
                        "Wx": getCity.weatherElement[0].time[i].elementValue[0].value,
                        "Wx_n": getCity.weatherElement[0].time[i].elementValue[1].value,
                        "Temp": getCity.weatherElement[1].time[i].elementValue[0].value + '°-' + getCity.weatherElement[2].time[i].elementValue[0].value + '°'
                    },
                    "Night": {
                        "Wx": getCity.weatherElement[0].time[i+1].elementValue[0].value,
                        "Wx_n": getCity.weatherElement[0].time[i+1].elementValue[1].value,
                        "Temp": getCity.weatherElement[1].time[i+1].elementValue[0].value + '°-' + getCity.weatherElement[2].time[i].elementValue[0].value + '°'
                    }
                });
            }
            //一週物件天氣陣列
            weatherObj[getCity.locationName]["weekWeather"] = Day;
        });
    });
};

//--------------------取得逐三小時預報資料--------------------
var getThreeHoursData = function(){
    $.getJSON("https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-089?Authorization=CWB-268DE0E2-66E8-4AE9-A0C3-B06F7EBB5E7A&format=JSON&elementName=Wx,T,PoP6h",function(Data){
        Data["records"]["locations"][0]["location"].map(function(getCity){
            //宣告暫存陣列
            var DayObj = [], Index = -1, startIndex, Today = new Date();//宣告暫存陣列
            firstDataHour = Number(getCity.weatherElement[0].time[0].startTime.substring(11,13));
            startIndex = (Today.getHours() == 0 ? 24 : Today.getHours()) > (firstDataHour == 0 ? 24 : firstDataHour) ? 1 : 0;
            //建立一週各時間之現象、現象代碼、溫度陣列
            for(var i = startIndex; i < startIndex + 17; i++){
                var DateStr = getCity.weatherElement[0].time[i].startTime.substring(5,10).replace('-','/');
                //建立各「日」物件陣列（陣列為空或日期換日時，物件放到陣列的下一個位置）
                if(Index == -1 || DayObj[Index]["Date"] != DateStr)
                    DayObj[++Index] = {"Date": DateStr, "Hour": []};
                //建立各「小時」物件陣列（依日期Index放入）
                DayObj[Index]["Hour"].push({
                    "Hour": Number(getCity.weatherElement[0].time[i].startTime.substring(11,13)) + '時',
                    "Wx": getCity.weatherElement[0].time[i].elementValue[0].value,
                    "Wx_n": getCity.weatherElement[0].time[i].elementValue[1].value,
                    "DayNight": getCity.weatherElement[0].time[i].startTime.substring(11,13) >= '12' ? 'night' : 'day',
                    "Temp": getCity.weatherElement[1].time[i].elementValue[0].value + '°C',
                    "PoP": getCity.weatherElement[2].time[Math.floor(i/2)].elementValue[0].value + '%'
                });
            }
            //一週物件天氣陣列
            weatherObj[getCity.locationName]["threeHours"] = DayObj;
        });
    });
};