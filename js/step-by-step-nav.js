/**
 * @file
 * Additional behaviour for the Step by step navigation.
 */

(function($, Drupal, drupalSettings) {
  console.log('running');
  function titlesum(){ 
    // add initial step view links based on active step status
    $("ol.step-list .step").each(function() {
        if ($(this).hasClass('step--active')) {
            $(this).find('.step__title').append("<a href='#' class='step-show'>Show less</a>");
            $(this).find('.step__summary').addClass('step-show-summary');
        } else {
            $(this).find('.step__title').append("<a href='#' class='step-show'>Show more</a>");
        };
     });
    }

  function stepstext(){
    $("ol.step-list .step").each(function() {
      if ($(".step__summary").is(':visible')) {
         $(this).find('.step-show').text('Show less');
      } else {
         $(this).find('.step-show').text('Show more');
      }
    });

  }

  // run titlesum funtion on load
  titlesum();

  // add the hide all option
  $("<i class='fas fa-eye'></i><a href='#' class='step-master pl-2'>Hide steps</a>").insertBefore("ol.step-list");
  

  // handle show hide of summaries
  $('.step-show').on("click", function (e){

    $(this).parent().siblings(".step__summary").toggleClass("step-show-summary");

    if ($(this).parent().siblings(".step__summary").is(':visible')) {
             $(this).text('Show less');                
        } else {
             $(this).text('Show more');                
        }
    e.preventDefault();
    
  });

  // handle hide show of all summaries
  $('.step-master').on("click", function (e){

    if ($(".step__summary").is(':visible')) {
      $(".step__summary").removeClass("step-show-summary");
            $(this).text('Show steps');             
        } else {
          $(".step__summary").addClass("step-show-summary");
            $(this).text('Hide steps');            
        }
    stepstext(); // update the steps text
    e.preventDefault();
  });
  

  Drupal.behaviors.step_by_step = {
    attach: function onload(context, settings) {
      // Custom code goes here.  Please note that this function can get called
      // more than once after page load.
      

    }
  }
})(jQuery, Drupal, drupalSettings);
