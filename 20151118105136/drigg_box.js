/*

To call this block:

<script type="text/javascript">
  var section="All";
  var how_many=10;
  var show_karma=1;
  var bg_color ="FFFFFF";
  var text_color="333333";
  var score_bg_color="FFFFCC";
  var score_text_color="000000";
  var link_color="333333";
  var border_color="000000";
  var score_border_color="000000";
  var text_size="8";
  var logo_style="light";

</script>
<script type="text/javascript" src="http://www.drigg.org/sites/www.drigg.org/modules/drigg/drigg_box.js"></script>
*/

/* 
   ---------------------------------------
   --          DEFAULT VALUES           --
   --       (Change here as needed)     --
   ---------------------------------------
*/

var def_fetch_host="www.fsdaily.com"; /* NO http:// IN FRONT OF THIS! */
var def_fetch_path="/drigg/handle?operation=top";


var def_section="All";
var def_how_many=10;
var def_show_karma=1;
var def_bg_color ="FFFFFF";
var def_text_color="333333";
var def_score_bg_color="FFFFCC";
var def_score_text_color="000000";
var def_link_color="333333";
var def_border_color="000000";
var def_score_border_color="000000";
var def_text_size="8";
var def_logo_style="light";

/* 
   -------------------------------------------
   --       END OF DEFAULT VALUES           --
   -------------------------------------------
*/

//var iframeTmp = document.createElement("iframe");
//var iframeObj = document.body.appendChild(iframeTmp); */

//var iframeObj = document.getElementById('block-block-47').appendChild(iframeTmp); // Attempt that actually works, BUT...


// Commented out by Tony
//if ( !def_fetch_host ) {
//	def_fetch_host = iframeObj.previousSibling.src.replace( /(http:\/\/)/, '' );
//	def_fetch_host = def_fetch_host.replace( /\/.*/, '' );
//}

var def_fetch_url="http://"+def_fetch_host+def_fetch_path;

var db_list = {
	"section"      : 
          (typeof(section)!='undefined')?section:def_section,

	"bg_color" : 
          (typeof(bg_color)!='undefined')?bg_color:def_bg_color,
	"text_color" : 
          (typeof(text_color)!='undefined')?text_color:def_text_color,
	"score_bg_color": 
          (typeof(score_bg_color)!='undefined')?score_bg_color:def_score_bg_color,
	"score_text_color": 
          (typeof(score_text_color)!='undefined')?score_text_color:def_score_text_color,
	"link_color": 
          (typeof(link_color)!='undefined')?link_color:def_link_color,

        "border_color":
          (typeof(border_color)!='undefined')?border_color:def_border_color,
        "score_border_color":
          (typeof(score_border_color)!='undefined')?score_border_color:def_score_border_color,
        "text_size":
          (typeof(text_size)!='undefined')?text_size:def_text_size,
        "logo_style":
          (typeof(logo_style)!='undefined')?logo_style:def_logo_style,
        "how_many":
          (typeof(how_many)!='undefined')?how_many:def_how_many,
        "show_karma":
          (typeof(show_karma)!='undefined')?show_karma:def_show_karma

}
var src  = def_fetch_url;
for (var db_args in db_list) {
	src += "&"+db_args+"="+db_list[db_args];
}

document.write('<iframe src='+src+' frameborder="0" height="'+box_height+'" width="'+box_width+'" name="drigg_box" id="drigg_box"></iframe>');

//document.getElementById('drigg_box').setAttribute('frameBorder','0');
//document.getElementById('drigg_box').frameBorder=0;


/*iframeTmp.frameBorder = 0;
iframeTmp.setAttribute('frameBorder','0'); // Picky IE (doesn't work anyway)
iframeTmp.height = (typeof(box_height)!='undefined')?box_height:"300px";
iframeTmp.width = (typeof(box_width)!='undefined')?box_width:"400px";
iframeTmp.name = "drigg_box";
*/

delete def_fetch_host;
delete def_fetch_path;
