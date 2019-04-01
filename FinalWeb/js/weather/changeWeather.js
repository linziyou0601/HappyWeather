//----------改目前天氣----------
var changeCurrent = function(cityName){
    $('#currentWx').html(weatherObj[cityName]["currentWx"]);
    $('#currentTemp').html(weatherObj[cityName]["currentTemp"]);
    $('#currentPoP').html('降雨機率　' + weatherObj[cityName]["currentPoP"]);
    $('#currentHUMD').html('濕　　度　' + weatherObj[cityName]["currentHUMD"]);
    $('#current24R').html('今日雨量　' + weatherObj[cityName]["current24R"]);
};
//----------改今明預報----------
var changeTwoDays = function(cityName){
    $('#twoDaysCity').html(cityName);
    for(var i = 0; i < 3; i++){
        //依時間將天氣資料帶入
        var Data = weatherObj[cityName]["twoDays"];
        var nowTime = '<td>' + Data["Day"][i].substring(0,4) + '</td>';
        nowTime += '<td>' + Data["Temp"][i] + '</td>';
        nowTime += '<td><img width="60px" src="images/weatherIcon/' + Data["DayNight"][i] + '/' + Data["Wx_n"][i] + '.svg" title="' + Data["Wx"][i] + '"/></td>';
        nowTime += '<td>' + Data["CI"][i] + '</td>';
        nowTime += '<td>' + Data["PoP"][i] + '</td>';
        //放至<tr>裡
        $('#twoDaysTimes0' + (i+1)).html(nowTime);
    };
};
//----------改一週預報----------
var changeWeek = function(cityName){
    var dayTitle = '<th id="weekCity">' + cityName + '</th>', dayData = '<td>白天</td>', nightData = '<td>晚上</td>';
    for(var i = 0; i < 7; i++){
        //依時間將天氣資料帶入
        var Data = weatherObj[cityName]["weekWeather"][i];
        dayTitle += '<th>' + Data["Date"] + '</th>';
        dayData += '<td><img width="40px" src="images/weatherIcon/day/' + Data["Day"]["Wx_n"] + '.svg" title="' + Data["Day"]["Wx"] + '"/><br/>';
        dayData += Data["Day"]["Temp"] + '</td>';
        nightData += '<td><img width="40px" src="images/weatherIcon/night/' + Data["Night"]["Wx_n"] + '.svg" title="' + Data["Night"]["Wx"] + '"/><br/>';
        nightData += Data["Night"]["Temp"] + '</td>';
    };
    //放至<tr>裡
    $('#weekWeatherTitle').html(dayTitle);
    $('#weekWeatherDay').html(dayData);
    $('#weekWeatherNight').html(nightData);
};