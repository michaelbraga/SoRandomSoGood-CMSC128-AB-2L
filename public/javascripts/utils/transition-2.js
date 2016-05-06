 $(document).ready(function(){
    $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
  });
 
// Toggle Function
$('.toggle').click(function(){
  alert("clicked");
  // Switches the Icon
  $(this).children('i').toggleClass('fa-pencil');
  // Switches the forms  
/*  $('.form').animate({
    height: "toggle",
    'padding-top': 'toggle',
    'padding-bottom': 'toggle',
    opacity: "toggle"
  }, "slow"); */
  var id=$(this).parent().children("div.form").attr("id");
  var id2=$(this).parent().children("div.form:nth-child(3)").attr("id");
  console.log(id+"\n");
  console.log(id2);
  $(".form-module .form:nth-child(3)").attr("display", "none");

  $("#"+id).animate({
    height: "toggle",
    'padding-top': 'toggle',
    'padding-bottom': 'toggle',
    opacity: "toggle"
  }, "slow");

   $("#"+id2).animate({
    height: "toggle",
    'padding-top': 'toggle',
    'padding-bottom': 'toggle',
    opacity: "toggle"
  }, "slow");


/*
  var condition = $(".form-module #class1").attr("display");
  if (condition == none){
    $(".form-module #class1").attr("display", "none");
    $(".form-module #class1").attr("padding", "40px");

    $(".form-module #class1a").attr("display", "block");
  } else {
    (".form-module #class1a").attr("display", "none");
    $(".form-module #class1a").attr("padding", "40px");

    $(".form-module #class1").attr("display", "block");
  }
*/
});