/**
 * @file
 * Additional behaviour for the Step by step navigation.
 */

(function($, Drupal, drupalSettings) {

  Drupal.behaviors.step_by_step = {
    attach: function onload(context, settings) {
      // Custom code goes here.  Please note that this function can get called
      // more than once after page load.
      console.log('working');


      $(".step-list .step").each(function(i) {
	      if ($(this).hasClass('step--active')) {
	      	this.append("<a href=''>Show Less</a>");
	      } else {
	      	this.append("<a href=''>Show More</a>");
	      };
	  });
      

    }
  }
})(jQuery, Drupal, drupalSettings);
