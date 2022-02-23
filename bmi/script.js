var rangeSlider = function(){
  var slider = $('.row'),
      range = $('.value_range'),
      value = $('.field-text');
    
  slider.each(function(){

    value.each(function(){
      var value = $(this).prev().attr('value');
      $(this).html(value);
    });

    range.on('input', function(){
      $(this).next(value).html(this.value);
    });
  });
};
rangeSlider();

$('#submit').click(function(){
  var h = $('#height').val() / 100;
  var w = $('#weight').val();
  var bmi = h * h ;
  bmi = w/bmi;
  bmi = (bmi).toFixed(1);
  $('#bmiValue').html(bmi + " ");
  if (bmi < 18.5) {
    //Underweight
    $('.result-text').css('background','-webkit-linear-gradient(left top, #27939D, #07658F)');
    $('.result-text').css('background','-o-linear-gradient(bottom right, #27939D, #07658F)');
    $('.result-text').css('background','-moz-linear-gradient(bottom right, #27939D, #07658F)');
    $('.result-text').css('background','linear-gradient(to bottom right, #27939D, #07658F)');
    $('#bmid').html("Underweight");
  } else if ((18.5 <= bmi) && (bmi <= 24.9)) {
    //Normal weight
    $('.result-text').css('background','-webkit-linear-gradient(left top, #4FD24D, #4CA456)');
    $('.result-text').css('background','-o-linear-gradient(bottom right, #4FD24D, #4CA456)');
    $('.result-text').css('background','-moz-linear-gradient(bottom right, #4FD24D, #4CA456)');
    $('.result-text').css('background','linear-gradient(to bottom right, #4FD24D, #4CA456)');
    $('#bmid').html("Normal");
  } else if ((25 <= bmi) && (bmi <= 29.9)) {
    //Overweight   
    $('.result-text').css('background','-webkit-linear-gradient(left top, #EF7532, #DC3A26)');
    $('.result-text').css('background','-o-linear-gradient(bottom right, #EF7532, #DC3A26)');
    $('.result-text').css('background','-moz-linear-gradient(bottom right, #EF7532, #DC3A26)');
    $('.result-text').css('background','linear-gradient(to bottom right, #EF7532, #DC3A26)');
    $('#bmid').html("Overweight");
  } else {
    //Obese
    $('.result-text').css('background','-webkit-linear-gradient(left top, #F73946, #FF3875)');
    $('.result-text').css('background','-o-linear-gradient(bottom right, #F73946, #FF3875)');
    $('.result-text').css('background','-moz-linear-gradient(bottom right, #F73946, #FF3875)');
    $('.result-text').css('background','linear-gradient(to bottom right, #F73946, #FF3875)');
     $('#bmid').html("Obese");
  }
  console.log(bmi);
});

$('input[type="range"]').change(function () {
 var val = ($(this).val() - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min'));
    
    $(this).css('background-image',
                '-webkit-gradient(linear, left top, right top, '
                + 'color-stop(' + val + ', #F73946), '
                + 'color-stop(' + val + ', #27283A)'
                + ')'
                );
});

$('.value_range').each(function (){
   var val = ($(this).val() - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min'));
    
    $(this).css('background-image',
                '-webkit-gradient(linear, left top, right top, '
                + 'color-stop(' + val + ', #F73946), '
                + 'color-stop(' + val + ', #27283A)'
                + ')'
                );
});