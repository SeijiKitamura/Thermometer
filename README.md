# jQuery Plugin thermometer.js

![2018年8月30日](https://raw.github.com/wiki/SeijiKitamura/thermometer/06.png)

***

CSVファイルに記録されている温度、湿度を画面に表示するjQuery pluginです。  
Raspberry　Piに接続されている温度計から出力したデータを見るために作りました。

## CSVファイルフォーマット

CSVフォーマットサンプルです。実際のファイルには列名は不要です。

|任意の番号|日付(YYYY-MM-DD|時(HH)|分(MM)|温度 |気圧   |湿度 |
|----------|---------------|------|------|---- |----   |---- |
| 1        | 2018-08-29    | 00   | 00   |30.16|1009.68|55.54|
| 1        | 2018-08-29    | 01   | 00   |30.19|1009.42|55.72|
| 1        | 2018-08-29    | 02   | 00   |30.25|1009.74|55.62|
| 1        | 2018-08-29    | 03   | 00   |30.24|1009.84|55.79|
| 1        | 2018-08-29    | 04   | 00   |30.26|1009.82|55.85|

- ファイル名: YYYYMMDD.csv
- 列名： なし

## CSVディレクトリとファイル名
    root
      │
      ├─ data
      │   |
      │   ├ YYYYMMDD.csv
      │
      ├─ index.html
      ├─ month_list.html
      ├─ YYYYMM.html
      ├─ jquery.js
      ├─ thermometer.js

## HTML
HTMLに以下を追加してください。
(jquery.jsとthemometer.jsは環境に合わせてPATHを変更してください)
```html
<head>
  <script src="jquery.js"></script>
  <script src="themometer.js"></script>
</head>
```

## 使い方
### minutes: (毎分データ）
![2018年8月30日](https://raw.github.com/wiki/SeijiKitamura/thermometer/01.png)

指定日の温度データを希望する間隔で表示することができます。

(sample)
```html
<!doctype html>
<html lang=ja>

  <head>
    <script src="jquery.js"></script>
    <script src="themometer.js"></script>
  </head>

  <body>
    <div id="something">
    </div>
  </body>

  <script>

    $(function(){
      var options= {
        temp_date:   2018-08-30, //表示日(YYYY-mm-dd)
        start_hour:  9         , //表示開始時間（0−23）
        minute_span: 60        , //表示間隔（1-60)
        max_temp:    10          //許容温度 (これを超えると赤くなる）
      };

      $("div#something").thermometer("minutes",options);
    });

  </script>
```

上のコマンドは以下の条件を指定しています。
* 日付: 2018年8月30日
* 時間: 9時以降のデータ
* 間隔: 60分間隔

### last_temp:　指定日の最後に計測したデータを表示します。

![2018年8月30日](https://raw.github.com/wiki/SeijiKitamura/thermometer/02.png)

日付を指定しない場合は最新温度、指定した場合はその日の最終温度が表示されます。

(sample)
```html
<!doctype html>
<html lang=ja>

  <head>
    <script src="jquery.js"></script>
    <script src="themometer.js"></script>
  </head>

  <body>
    <div id="something">
    </div>
  </body>

  <script>
    $(function(){
      $("div#someting").thermometer("last_temp");
    });
  </script>

</html>
```

日付を指定し場合、その日の最終の温度と湿度を表示します。（2018年8月1日）
```javascript
$(function(){
  var options={"temp_date": "2018-08-01"};
  $("div#someting").last_temp("last_temp",options);
});
```

### month_list　CSVファイルが存在する年月一覧を表示します。

![2018年8月30日](https://raw.github.com/wiki/SeijiKitamura/thermometer/03.png)

まず、ルートディレクトリに以下のHTMLを用意しファイル名をmonth_list.htmlとします。

```html
<!-- month_list.html -->
<td><a href="#data_panel">201812</a></td>
<td><a href="#data_panel">201811</a></td>
<td><a href="#data_panel">201810</a></td>
・・・
```

以下のHTMLを用意し表示します。
表示されたデータにはクリックイベントが登録されています。
希望の年月をクリックするとdays_listが実行されます。

```html
<!doctype html>
<html lang=ja>

  <head>
    <script src="jquery.js"></script>
    <script src="themometer.js"></script>
  </head>

  <body>
    <div id="something">
    </div>
  </body>

  <script>
    $(function(){
      $("div#something").thermometer("month_list");
    });
  </script>

</html>
```


### days_list:　ルートディレクトリにあるYYYYMM.html(YYYYMMは年月）を表示
![2018年8月30日](https://raw.github.com/wiki/SeijiKitamura/thermometer/04.png)

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

次に以下のようなHTMLを用意します。
```html
<!doctype html>
<html lang=ja>

  <head>
    <script src="jquery.js"></script>
    <script src="themometer.js"></script>
  </head>

  <body>
    <!-- 日別温度を表示するHTML -->
    <div id="something">
    </div>

    <!-- クリックイベント時に表示するデータ用HTML -->
    <div id="data_panel">
    </div>
  </body>

  <script>
    $(function(){
      $("div#something").thermometer("days_list");
    });
  </script>

```
div#somethingに表示された行にはクリックイベントが登録されています。
該当する日付をクリックするとその日のデータがdiv#data_panelに表示されます。  
下記は8月29日をクリックした時に表示されるデータです。

![2018年8月30日](https://raw.github.com/wiki/SeijiKitamura/thermometer/05.png)
