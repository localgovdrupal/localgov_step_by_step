/**
 * @file
 * Additional behaviour for the Step by step navigation.
 */

(function lgdStepByStepScript($, Drupal) {
  Drupal.behaviors.lgdStepByStepNav = {
    attach() {
      const stepByStep = {};
      stepByStep.showAllText = 'Show summaries';
      stepByStep.hideAllText = 'Hide summaries';
      stepByStep.showStepText = 'Show step summary';
      stepByStep.hideStepText = 'Hide step summary';

      // Set visibility based on specified button.step-show elements.
      function summaryVisiblity(elements, cmd) {
        switch (cmd) {
          case 'show':
            elements.each(function showSummary() {
              const stepTitle = $(this)
                .parents('.step__title')
                .find('a')
                .text();
              $(this)
                .parents('.step')
                .find('.step__summary')
                .addClass('step-show-summary');
              $(this).text(stepByStep.hideStepText);
              $(this).attr('aria-expanded', 'true');
              $(this).attr(
                'aria-label',
                Drupal.t('Hide step summary - !summary_message', {
                  '!summary_message': stepTitle,
                }),
              );
            });
            // 'Hide all' control displayed if all steps are shown.
            if ($('.step__summary').length === $('.step-show-summary').length) {
              $('.step-master').text(stepByStep.hideAllText);
              $('.summaries-control i')
                .addClass('fa-eye-slash')
                .removeClass('fa-eye');
            }
            break;

          case 'hide':
            elements.each(function hideSummary() {
              const stepTitle = $(this)
                .parents('.step__title')
                .find('a')
                .text();
              $(this)
                .parents('.step')
                .find('.step__summary')
                .removeClass('step-show-summary');
              $(this).attr('aria-expanded', 'false');
              $(this).text(stepByStep.showStepText);
              $(this).attr(
                'aria-label',
                Drupal.t('Show step summary - !summary_message', {
                  '!summary_message': stepTitle,
                }),
              );
            });
            // 'Show all' control displayed if any steps are hidden.
            $('.step-master').text(stepByStep.showAllText);
            $('.summaries-control i')
              .addClass('fa-eye')
              .removeClass('fa-eye-slash');
            break;

          default:
            break;
        }
      }

      const $summaries = $('ol.step-list .step .step__summary');
      let anySummaries = false;
      $summaries.each(function eachSummary() {
        if ($(this).text().trim() !== '') {
          anySummaries = true;
          return false; // Exit loop early.
        }
      });

      // Insert show all button.
      if (anySummaries) {
        $(
          `<div class='summaries-control'>
            <i class='fas fa-eye'></i>
            <button aria-expanded='false' class='step-master ml-2'>
              ${stepByStep.showAllText}
            </button>
          </div>`,
        ).insertBefore('ol.step-list');
      }

      // Insert hide/show button for each step.
      function stepSummaryButton(isVisible, stepTitle) {
        const $container = $("<span class='step-summary-container'>");
        const $button = $("<button class='step-show'>");
        $button.attr('aria-expanded', isVisible ? 'true' : 'false');
        if (isVisible) {
          $button.attr(
            'aria-label',
            Drupal.t('Hide step summary - !summary_message', {
              '!summary_message': stepTitle,
            }),
          );
        } else {
          $button.attr(
            'aria-label',
            Drupal.t('Show step summary - !summary_message', {
              '!summary_message': stepTitle,
            }),
          );
        }
        $button.text(
          isVisible ? stepByStep.hideStepText : stepByStep.showStepText,
        );
        $container.append($button);
        return $container;
      }

      $('ol.step-list .step').each(function initializeStep() {
        const isVisible = $(this).hasClass('step--active');
        const stepTitle = $(this).find('.step__title').text();
        if (isVisible) {
          $(this).find('.step__summary').addClass('step-show-summary');
        }
        const $stepSummary = $(this).find('.step__summary');
        if ($stepSummary.text().trim() !== '') {
          $(this)
            .find('.step__title')
            .append(stepSummaryButton(isVisible, stepTitle));
        }
      });

      // Show / hide all.
      $('.step-master').on('click', function toggleAllSteps() {

        const isExpanded = $(this).attr('aria-expanded') === 'true';

        if (isExpanded) {
          $(this).text(stepByStep.showAllText).attr('aria-expanded', 'false');
          $('.summaries-control i')
            .addClass('fa-eye')
            .removeClass('fa-eye-slash');
          summaryVisiblity($('.step-show'), 'hide');
        } else {
          $(this).text(stepByStep.hideAllText).attr('aria-expanded', 'true');
          $('.summaries-control i')
            .addClass('fa-eye-slash')
            .removeClass('fa-eye');
          summaryVisiblity($('.step-show'), 'show');
        }
      });

      // Show / hide single step.
      $('.step-show').on('click', function toggleSingleStep() {
        $(this)
          .parents('.step')
          .find('.step__summary')
          .toggleClass('step-show-summary');
        if ($(this).text() === stepByStep.showStepText) {
          summaryVisiblity($(this), 'show');
        } else {
          summaryVisiblity($(this), 'hide');
        }
      });
    },
  };
})(jQuery, Drupal, drupalSettings);
