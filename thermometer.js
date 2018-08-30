//プラグイン
(function($){
  $.fn.thermometer = function( method ) {
      if ( methods[method] ) {
        return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
      }
      else if ( typeof method === 'object' || ! method ) {
           return methods.init.apply( this, arguments );
      }
      else {
        $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
      }
  };

  var defaults = {
                  start_hour:  8,
                  minute_span: 60,
                  max_temp:    15,
                  temp_date:   ""
  };

  var messages = {
    col_3:      ["time","temp","hum"],
    col_5:      ["date","9","12","15","18","21"],
    now_title:  "Now",
    year_month: "Year/Month",
    month_days: "Month/Days",
    click_to:   "Click somedays ..."
  };

  //Japanese
  var messages = {
    col_3:  ["時間","温度","湿度"],
    col_5:  ["日付","9時","12時","15時","18時","21時"],
    now_title: "現在温度",
    year_month: "年月",
    month_days: "日別一覧",
    click_to:   "日付をクリック"
  };

  //html createor
  var html    =  {
    panel_heading: function(text){
                     return $("<div>").addClass("panel-heading")
                                      .text(text);
                   },
    panel_body:    function(child){
                     return $("<div>").addClass("panel-body")
                                      .html(child);
                   },

    h3_title:      function(text){
                     return  $("<h3>").addClass("temp_date")
                                     .text(text);
                   },
    table:         function(){
                     return $("<table>").addClass("table table-striped");
                   },
    thead_3col:    function(){
                     var columns = messages.col_3;
                     var tr = $("<tr>");
                     for(var i = 0;i < columns.length;i++){
                       tr.append($("<th>").text(columns[i]));
                     }
                     return $("<thead>").append(tr);
                   },
    thead_5col:    function(){
                     var columns = messages.col_5;
                     var tr = $("<tr>");
                     for(var i = 0;i < columns.length;i++){
                       tr.append($("<th>").text(columns[i]));
                     }
                     return $("<thead>").append(tr);
                   },
    tbody:         function(){
                     return $("<tbody>");
                   },
    table_3col:    function(){
                     var table = html.table();
                     return table.append(html.thead_3col)
                                 .append(html.tbody);
                   },
    table_5col:    function(){
                     var table = html.table();
                     return table.append(html.thead_5col)
                                 .append(html.tbody);
                   },
    now_p:         function(){
                     return $("<p>").addClass("text_primary");
                   },
    last_temp:     function(){
                     return $("<strong>").attr("id","last_temp")
                                         .addClass("text-primary")
                                         .attr("style","font-size: 6em;")
                                         .add($("<small>").text("℃ ")
                                                          .addClass("text-primary")
                                                          .attr("style","font-size: 2em;")

                                          );
                   },
    last_hum:      function(){
                     return $("<strong>").attr("id","last_hum")
                                         .addClass("text-primary")
                                         .attr("style","font-size: 6em;")
                                         .add($("<small>").text("% ")
                                                          .addClass("text-primary")
                                                          .attr("style","font-size: 2em;")
                                          );
                   }
  };

  var methods ={
    init:        function(options){ },
    minutes:     function(options){
                   return this.each(function(){
                     var setting = set_option($(this),options);
                     //
                     $(this).empty();

                     //panel-heading
                     var title  = date_to_string(setting.temp_date,"-");
                     var panel_heading = html.panel_heading(title);
                     $(this).append(panel_heading);

                     //panel-body
                     var h3 = html.h3_title(title);
                     var panel_body    = html.panel_body(h3);
                     $(this).append(panel_body);

                     //table
                     $(this).append(html.table_3col);

                     //show data
                     $.ajax({url: setting.file_name,
                             type: "get",
                             cache: false})
                      .done((csv) => {
                        var tbody = $(this).find("table > tbody");
                        var tr = create_tr_minute(csv,setting);
                        tbody.html(tr);
                      });
                   }); // return this.each(function(){
                 },//minutes:     function(options){

   last_temp:    function(options){
                   return this.each(function(){
                     var setting = set_option($(this),options);

                     var title = messages.now_title;
                     var panel_heading = html.panel_heading(title);
                     $(this).append(panel_heading);

                     //panel-body
                     var panel_body    = html.panel_body(h3);
                     var h3 = html.h3_title(title)
                                  .addClass("text-primary");
                     panel_body.append(h3);

                     //panel-body
                     var now_p = html.now_p();
                     now_p.append(html.last_temp())
                          .append(html.last_hum());
                     panel_body.append(now_p);

                     $(this).append(panel_body);

                     //show data
                     $.ajax({url: setting.file_name,
                             type: "get",
                             cache: false})
                      .done((csv) => {
                        var csv_ary = csv.split("\n");
                        var last_ary;
                        for(i = csv_ary.length -1; i>0,i--;){
                          if ( csv_ary[i] ){
                           last_ary = csv_ary[i];
                           break;
                          }
                        }
                        row_ary = last_ary.split(",");
                        var nitiji = row_ary[1] + " "+row_ary[2] + ":" + row_ary[3];
                        $(this).find("h3").text(nitiji);
                        $(this).find("strong#last_temp")
                               .text(Math.floor(row_ary[4]));
                        $(this).find("strong#last_hum")
                               .text(Math.floor(row_ary[6]));
                        if (row_ary[4] > setting.max_temp){
                          $(this).addClass("panel-danger").removeClass("panel-primary");
                          $(this).children()
                                 .find(".text-primary")
                                 .addClass("text-danger")
                                 .removeClass("text-primary");
                        }
                       });
                   }); //return this.each(function(){
                 },// last_temp:     function(){

   month_list:   function(){
                   var $this = this;
                   return this.each(function(){
                     //panel-heading
                     var title = messages.year_month;
                     var panel_heading = html.panel_heading(title);
                     $(this).append(panel_heading);

                     //panel-body
                     var panel_body    = html.panel_body();
                     $(this).append(panel_body);

                     //table
                     var table = html.table();
                     table.append(html.tbody());
                     $(this).append(table);

                     //show data
                     $.ajax({url: "month_list.html",
                             type: "get",
                             cache: false})
                      .done((html)=>{
                        $(this).find("table > tbody")
                               .html(html);
                        var tr = $(this).find("table > tbody tr")
                        tr.on({"click": function(){
                                          var options ={};
                                          options.nen_tuki=$(this).find("td").text();
                                          //以下のoptionsがうまく渡せない
                                          //methods["days_list"].apply($("#day_panel"),options);
                                          $("#day_panel").thermometer("days_list",options);
                                        }
                        });
                      });
                   }); // return this.each(function(){
                 },// month_list:   function(){

   days_list:    function(options){
                   return this.each(function(){
                     var setting = set_option($(this),options);

                     if(! setting.nen_tuki){
                       var nen = new Date().getFullYear();
                       var tuki = new Date().getMonth() + 1;
                       if (tuki < 10 ) tuki = "0"+tuki;
                       var setting ={}
                       setting.nen_tuki = nen + "" + tuki;
                       var setting = set_option($(this),setting);
                     }

                     //panel-heading
                     //var title = "Month/days";
                     //var title = "日別一覧";
                     var title = messages.month_days;
                     var panel_heading = html.panel_heading(title);
                     $(this).append(panel_heading);

                     //panel-body
                     var h3 = html.h3_title(messages.click_to);
                     var panel_body    = html.panel_body(h3);
                     $(this).append(panel_body);

                     //table
                     $(this).append(html.table_5col);

                     //show data
                     $.ajax({
                             url: setting.nen_tuki+".html",
                             type: "get",
                             cache: false})
                      .done((html) =>{
                        $(this).find("table > tbody").html(html);
                        //最高温度以上なら赤く表示
                        $(this).find("table > tbody > tr > td:gt(0)").each(function(){
                          var temp = ($(this)).text();
                          if (temp && Number(temp) > setting.max_temp){
                            $(this).addClass("text-danger");
                          };
                        });

                        $(this).find("table > tbody > tr").each(function(){
                          //日付クリックイベント
                          var temp_date_string = $(this).children().first().text();
                          var options = {"temp_date" :  temp_date_string};
                          $(this).on("click",function(){
                            $("div#data_panel").thermometer("minutes",options);
                            $("html,body").animate({scrollTop: $("div#data_panel").offset().top - 70});
                          });
                        });
                       });
                   }); // return this.each(function(){
                 },// days_list:    function(options){
  };

  //data-属性にoptionsをセット
  function set_option(element,options){
    var setting = $.extend(defaults,options);
    if ( ! setting.temp_date ){
      setting.temp_date = date_to_string(new Date(),"-");
    }
    setting.file_name = data_file_path(setting.temp_date);
    $.each(setting,function(key_,val_){
      if(! key_.match(/[0-9]/)){
        element.attr("data-"+key_,val_);
      }
    });
    return setting;
  }

  //データ表示用に加工
  function create_tr_minute(csv,options){
    var csv_ary = csv.split("\n");
    var html ="";

    $.each(csv_ary,function(i,val){
      if ( val.length > 0 ){
        var row_ary = val.split(",");
        var jikan = row_ary[2] + ":" + row_ary[3];
        var temp  = row_ary[4];
        var hum   = row_ary[6];
        var tr_html = "";
        if ( temp >= options.max_temp ){
          tr_html = "<tr class='text-danger'>";
        }
        else{
          tr_html = "<tr>";
        }
        tr_html+= "<td>" + jikan + "</td>";
        tr_html+= "<td>" + temp  + "</td>";
        tr_html+= "<td>" + hum   + "</td>";
        tr_html+= "</tr>";

        if ( Number(row_ary[2]) >= options.start_hour ) {
          //60分間隔
          if ( options.span == 60 ){
            if ( row_ary[3] == "00" ){
              html+= tr_html;
            }
          }// if ( span == 60 ){
          else if ( Number(row_ary[3]) % options.minute_span == 0 ){
            html+= tr_html;
          } //else if ( Number(jikan) % span == 0 ){
        } // if ( row_ary[2] > start_hour ) {
      } //if( val.lenth > 0 ){
    }); // $.each(csv_ary,function()){
    return html;
  }

  //日付を文字列に
  function date_to_string(date,separator){
    if ( separator == null) separater = "";
    if ( date      == null) date = new Date()
    else date = new Date(date);
    var tosi = date.getFullYear();
    var tuki = date.getMonth() + 1;
    var hi   = date.getDate();
    tuki = tuki < 10 ? "0" + tuki : tuki;
    hi   = hi   < 10 ? "0" + hi : hi;
    return tosi + separator + tuki + separator + hi;
  }

  //日付をファイルパスに
  function data_file_path(date){
    var file_path = "./data/" + date_to_string(date,"") + ".csv";
    return file_path;
  }

})(jQuery);
