/**
 * @file
 * Additional behaviour for the Step by step navigation.
 */

(function($, Drupal, drupalSettings) {
  
  // add initial step view links based on active step status
  function titlesum(){ 
    $("ol.step-list .step").each(function() {
        if ($(this).hasClass('step--active')) {
            $(this).find('.step__title').append("<a href='#' class='step-show'>Show less about this step</a>");
            $(this).find('.step__summary').addClass('step-show-summary');
        } else {
            $(this).find('.step__title').append("<a href='#' class='step-show'>Show more about this step</a>");
        };
     });
    }

  // switch text in and out (more precise that toggling)
  function stepstext(){
    $("ol.step-list .step").each(function() {
      if ($(".step__summary").is(':visible')) {
         $(this).find('.step-show').text('Show less about this step');
      } else {
         $(this).find('.step-show').text('Show more about this step');
      }
    });
  }

  // run titlesum function on load
  titlesum();

  // add the hide all option on load
  if ($(".step__summary").is(':visible')) {
  $("<i class='fas fa-eye-slash'></i><a href='#' class='step-master pl-2'>Hide steps</a>").insertBefore("ol.step-list");
  } else {
    $("<i class='fas fa-eye'></i><a href='#' class='step-master pl-2'>Show steps</a>").insertBefore("ol.step-list");
  };

  // handle show hide of summaries
  $('.step-show').on("click", function (e){
    $(this).parent().siblings(".step__summary").toggleClass("step-show-summary");
    if ($(this).parent().siblings(".step__summary").is(':visible')) {
      $(this).text('Show less about this step');                
    } else {
      $(this).text('Show more about this step');                
    }
    e.preventDefault();
  });

  // handle hide show of all summaries
  $('.step-master').on("click", function (e){
   if ($(".step__summary").is(':visible')) {
    $(".step__summary").removeClass("step-show-summary");
      $(this).text('Show steps');
      $(this).prev().addClass('fa-eye').removeClass('fa-eye-slash');         
    } else {
      $(".step__summary").addClass("step-show-summary");
      $(this).text('Hide steps'); 
      $(this).prev().addClass('fa-eye-slash').removeClass('fa-eye');          
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
