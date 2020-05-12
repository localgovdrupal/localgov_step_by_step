/**
 * @file
 * Additional behaviour for the Step by step navigation.
 */

(function($, Drupal, drupalSettings) {
  
  // add initial step view links based on active step status
  function titlesum(){ 
    $("ol.step-list .step").each(function() {
        if ($(this).hasClass('step--active')) {
            $(this).find('.step__title').append("<span class='step-summary-container'><a href='#' class='step-show'>Hide step summary</a></span>");
            $(this).find('.step__summary').addClass('step-show-summary');
        } else {
            $(this).find('.step__title').append("<span class='step-summary-container'><a href='#' class='step-show'>Show step summary</a></span>");
        };
     });
    }

  // switch text in and out (more precise that toggling)
  function stepstext(){
    $("ol.step-list .step").each(function() {
      if ($(".step__summary").is(':visible')) {
         $(this).find('.step-show').text('Hide step summary');
      } else {
         $(this).find('.step-show').text('Show step summary');
      }
    });
  }

  // run titlesum function on load
  titlesum();

  // add the hide all option on load
  if ($(".step__summary").is(':visible')) {
  $("<div class='summaries-control'><i class='fas fa-eye-slash'></i><a href='#' class='step-master ml-2'>Hide summaries</a></div>").insertBefore("ol.step-list");
  } else {
    $("<div class='summaries-control'><i class='fas fa-eye'></i><a href='#' class='step-master ml-2'>Show summaries</a></div>").insertBefore("ol.step-list");
  };

  // handle show hide of summaries
  $('.step-show').on("click", function (e){
    $(this).parent().parent().siblings(".step__summary").toggleClass("step-show-summary");
    if ($(this).parent().parent().siblings(".step__summary").is(':visible')) {
      $(this).text('Hide step summary');                
    } else {
      $(this).text('Show step summary');                
    }
    e.preventDefault();
  });

  // handle hide show of all summaries
  $('.step-master').on("click", function (e){
   if ($(".step__summary").is(':visible')) {
    $(".step__summary").removeClass("step-show-summary");
      $(this).text('Show summaries');
      $(this).prev().addClass('fa-eye').removeClass('fa-eye-slash');         
    } else {
      $(".step__summary").addClass("step-show-summary");
      $(this).text('Hide summaries'); 
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
