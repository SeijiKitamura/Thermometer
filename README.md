# jQuery Plugin thermometer.js

CSVファイルに記録されている温度、湿度を画面に表示するjQuery
 pluginです。

## CSVファイルフォーマット
- ファイル名: YYYYMMDD.csv
- 列名： なし
- データ列:　左から
  - 任意の番号
  - 日付(YYYY-MM-DD
  - 時(HH)
  - 分(MM)
  - 温度
  - 気圧
  - 湿度

## CSVディレクトリとファイル名
- rootディレクトリにdataディレクトリ
- dataディレクトリにあるCSVファイル名はYYYYMMDD.csv

## HTML
HTMLに以下を追加してください。
(jQueryとthemometer.jsは環境に合わせてPATHを変更してください)
```html
<head>
  <script src="jquery.js"></script>
  <script src="themometer.js"></script>
</head>
```

## 使い方
### minutes:
分ごとのデータを表示します。

以下のようなdiv#somethingを用意します。
```html
<div id="something" class="panel panel-primary">
  <div class="panel-heading">
  </div>
  <div class="panel-body">
  </div>
  <table>
    <thead>
      <tr>
        <th>時間</th>
        <th>温度</th>
        <th>湿度</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
</div>
```

以下の条件で上記div#somethingに温度と湿度を表示します。
* 日付: 2018年8月3日
* 時間: 9時以降のデータ
* 間隔: 60分間隔

```javascript

$(function(){
  var options= {
    temp_date:   2018-08-03, //表示日(YYYY-mm-dd) 
    start_hour:  9         , //表示開始時間（0−23）
    minute_span: 60        , //表示間隔（1-60)
    max_temp:    10          //許容温度 (これを超えると赤くなる）
  };

  $("div#something").thermometer("minutes",options);
});
```


### last_temp:
指定日の最後のデータを表示します。

以下のようなdiv#somethingを用意します。
```html
<div id="something" class="panel panel-primary">
  <div class="panel-body">
    <h3 id="last_time"></h3>
    <p class="text-primary">
      <strong id="last_temp"></strong>
      <strong id="last_hum"></strong> 
    </p>
  </div>
</div>
```

現在の最終の温度と湿度を表示させます。
```javascript
$(function(){
  $("div#someting").last_temp("last_temp");
});
```

日付を指定し最終の温度と湿度を表示します。（2018年8月30日）
```javascript
$(function(){
  var options={"temp_date": "2018-08-30"};
  $("div#someting").last_temp("last_temp",options);
});
```

### month_list
CSVファイルが存在する年月一覧を表示します。
まず、ルートディレクトリに以下のHTMLを用意します。
```html
<td><a href="#data_panel">201812</a></td>
<td><a href="#data_panel">201811</a></td>
<td><a href="#data_panel">201810</a></td>
・・・
```

次に以下のようなdiv#somethingを用意します。
```html
<div id="something" class="panel panel-default">
  <table>
    <tbody>
    </tbody>
  </table>
</div>
```

以下のコードを実行するとデータが表示されます。
```jQuery
$(function(){
  $("div#something").thermometer("month_list");
});
```
表示されたデータにはクリックイベントが登録されています。
希望の年月をクリックするとdays_listが実行されます。

### days_list:
このメソッドはルートディレクトリにあるYYYYMM.html(YYYYMMは年月）を表示します。
1日の9時、12時、15時、18時、21時の温度を1行としてデータを表示します。
まずは以下のようなHTMLを用意し、ファイル名をYYYYMM.html(YYYYMMは年月）とします。
```html
<tr>
<td>YYYY-mm-dd</td>
<td>(9時の温度)</td>
<td>(12時の温度)</td>
<td>(15時の温度)</td>
<td>(18時の温度)</td>
<td>(21時の温度)</td>
</tr>
・・・
```

次に以下のようなdiv#somethingとdiv#data_panelを用意します。
```html
<!-- 日別温度を表示するHTML -->
<div id="something" class="panel panel-default">
  <table>
    <thead>
      <tr>
        <th>日付</th>
        <th>9時</th>
        <th>12時</th>
        <th>15時</th>
        <th>18時</th>
        <th>21時</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
</div>

<!-- クリックイベント時に表示するデータ用HTML -->
<div id="data_panel" class="panel panel-primary">
  <div class="panel-heading">
  </div>
  <div class="panel-body">
  </div>
  <table>
    <thead>
      <tr>
        <th>時間</th>
        <th>温度</th>
        <th>湿度</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
</div>
```

実行します。
```javascript
$(function(){
  $("div#something").thermometer("days_list");
});
```

div#somethingに表示された行にクリックイベントを登録しています。
該当する日付をクリックするとその日のデータがdiv#data_panelに表示されます
