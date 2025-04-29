/**
 * @file
 * Additional behaviour for the Step by step navigation.
 */

(function(Drupal) {
  /**
   * Drupal theme function for individual step show/hide button aria-label attr.
   *
   * @param {boolean} ariaExpanded
   *   The current aria-expanded state of the show/hide button. E.g., when set
   *   to false, we return the Show... message and vice-versa.
   */
  Drupal.theme.stepByStepAriaLabel = function(ariaExpanded, stepTitle) {
    let ariaLabel;

    if (ariaExpanded) {
      ariaLabel = Drupal.t("Hide step summary - !summaryMessage", {"!summaryMessage": stepTitle});
    } else {
      ariaLabel = Drupal.t("Show step summary - !summaryMessage", {"!summaryMessage": stepTitle});
    }

    return ariaLabel;
  }

  Drupal.theme.stepByStepStepHtml = function() {
    return `
      <span class="step-summary-container">
        <button class="step-show" type="button"></button>
      </span>
    `;
  }

  Drupal.theme.stepByStepSummariesControlHtml = function() {
    return `
      <div class="summaries-control">
        <i aria-pressed="false" class="fas fa-eye"></i>
        <button class="step-master ml-2" type="button"></button>
      </div>
    `;
  }

  /**
   * Drupal theme function for individual step button markup.
   *
   * TODO: update master.
   * NOTE: when overriding this function in a theme:
   *   - aria-label and aria-expanded buttons managed by step-by-step-nav.js.
   *   - button text also managed by step-by-step-nav.js, so the <button>
   *     element MUST NOT contain any child markup.
   */
  Drupal.theme.stepByStepStepShow = function(step, template, callback) {
    function handleStepClick() {
      const master = step.closest('.step-list').parentElement.querySelector('.step-master');
      const ariaExpanded = button.getAttribute('aria-expanded') !== 'true';
      const ariaLabel = Drupal.theme('stepByStepAriaLabel', ariaExpanded, title.textContent);

      if (ariaExpanded) {
        button.textContent = hideText;
        summary.classList.add(stepShowClass);
      } else {
        button.textContent = showText;
        summary.classList.remove(stepShowClass);
      }

      button.setAttribute('aria-expanded', ariaExpanded);
      button.setAttribute('aria-label', ariaLabel);
    }

    const stepShowClass = 'step-show-summary';
    const hideText = Drupal.t('Hide step summary');
    const showText = Drupal.t('Show step summary');
    const title = step.querySelector('.step__title');
    const summary = step.querySelector('.step__summary');
    let button;

    content = template.content.cloneNode(true);
    button = content.querySelector('.step-show');
    button.setAttribute('aria-label', Drupal.theme('stepByStepAriaLabel', false, title.textContent));
    button.setAttribute('aria-expanded', false);
    button.textContent = showText;
    button.addEventListener('click', handleStepClick);
    title.appendChild(button);
    callback();

    return { title, summary, button, };
  }

  /**
   * Drupal theme function for the summaries control button.
   *
   * NOTE: when overriding this function in a theme:
   *   - aria-label and aria-pressed buttons managed by step-by-step-nav.js.
   *   - button text also managed by step-by-step-nav.js, so the <button>
   *     element MUST NOT contain any child markup.
   *   - the <i> element may be safely removed (or altered to use a different
   *     icon).
   */
  Drupal.theme.stepByStepSummariesControl = function(nextEl, steps) {
    function handleStepMasterClick() {
      const ariaPressed = button.getAttribute('aria-pressed') !== 'true';

      if (ariaPressed) {
        button.textContent = hideText;

        if (icon) {
          icon.classList.add(iconPressedClass);
          icon.classList.remove(iconUnpressedClass);
        }
      } else {
        button.textContent = showText;

        if (icon) {
          icon.classList.add(iconUnpressedClass);
          icon.classList.remove(iconPressedClass);
        }
      }

      button.setAttribute('aria-pressed', ariaPressed);

      steps.forEach((step) => {
        const ariaExpanded = step.button.getAttribute('aria-expanded') === 'true';

        if (ariaExpanded !== ariaPressed) {
          step.button.click();
        }
      });
    }

    const iconPressedClass = 'fa-eye-slash';
    const iconUnpressedClass = 'fa-eye';
    const hideText = Drupal.t('Hide summaries');
    const showText = Drupal.t('Show summaries');
    const template = document.createElement('template');
    let button;
    let icon;

    template.innerHTML = Drupal.theme('stepByStepSummariesControlHtml');
    content = template.content.cloneNode(true);
    icon = content.querySelector('i.fas');
    button = content.querySelector('.step-master');
    button.textContent = showText;
    button.addEventListener('click', handleStepMasterClick);
    nextEl.parentElement.insertBefore(content, nextEl);

    return button;
  }

  Drupal.behaviors.stepByStepNav = {
    attach(context) {
      function stepCallback() {
        console.log('hello', control);
      }

      const [stepListEl] = once('sbs-steplist', '.step-list', context);
      const stepEls = once('sbs-step', '.step-list .step', context);
      const steps = [];
      let control;
      let stepTemplate;

      if (!stepListEl || !stepEls.length) {
        return;
      }

      // Set up individual steps.
      // This is more efficient when passed in from outside.
      stepTemplate = document.createElement('template');
      stepTemplate.innerHTML = Drupal.theme('stepByStepStepHtml');
      stepEls.forEach((stepEl) => {
        steps.push(Drupal.theme('stepByStepStepShow', stepEl, stepTemplate, stepCallback));
      });

      // Set up master control.
      control = Drupal.theme('stepByStepSummariesControl', stepListEl, steps);
    }
  };

  // const stepByStep = {};
  // stepByStep.showAllText = 'Show summaries';
  // stepByStep.hideAllText = 'Hide summaries';
  // stepByStep.showStepText = 'Show step summary';
  // stepByStep.hideStepText = 'Hide step summary';

  // // Set visibility based on specified button.step-show elements.
  // function summaryVisiblity(elements, cmd) {
  //   switch(cmd) {
  //     case 'show':
  //       elements.each(function() {
  //         var stepTitle = $(this).parents('.step__title').find('a').text();
  //         $(this).parents('.step').find('.step__summary').addClass('step-show-summary');
  //         $(this).text(stepByStep.hideStepText);
  //         $(this).attr("aria-expanded", "true");
  //         $(this).attr('aria-label', Drupal.t("Hide step summary - !summary_message", {"!summary_message": stepTitle}));
  //       });
  //       // 'Hide all' control displayed if all steps are shown.
  //       if ($('.step__summary').length === $('.step-show-summary').length) {
  //         $('.step-master').text(stepByStep.hideAllText);
  //         $('.summaries-control i').addClass('fa-eye-slash').removeClass('fa-eye');
  //       }
  //       break;

  //     case 'hide':
  //       elements.each(function() {
  //         var stepTitle = $(this).parents('.step__title').find('a').text();
  //         $(this).parents('.step').find('.step__summary').removeClass('step-show-summary');
  //         $(this).attr("aria-expanded", "false");
  //         $(this).text(stepByStep.showStepText);
  //         $(this).attr('aria-label',  Drupal.t("Show step summary - !summary_message", {"!summary_message": stepTitle}));
  //       });
  //       // 'Show all' control displayed if any steps are hidden.
  //       $('.step-master').text(stepByStep.showAllText);
  //       $('.summaries-control i').addClass('fa-eye').removeClass('fa-eye-slash');
  //       break;
  //   }
  // }

  // // Insert show all button.
  // $("<div class='summaries-control'><i class='fas fa-eye'></i><button aria-expanded='false' class='step-master ml-2'>" + stepByStep.showAllText + "</button></div>").insertBefore("ol.step-list");

  // // Insert hide/show button for each step.
  // function stepSummaryButton(isVisible, stepTitle) {
  //   var $container = $("<span class='step-summary-container'>");
  //   var $button = $("<button class='step-show'>");
  //   $button.attr('aria-expanded', isVisible ? "true" : "false");
  //   if (isVisible) {
  //     $button.attr('aria-label', Drupal.t("Hide step summary - !summary_message", {"!summary_message": stepTitle}));
  //   } else {
  //     $button.attr('aria-label', Drupal.t("Show step summary - !summary_message", {"!summary_message": stepTitle}));
  //   }
  //   $button.text(isVisible ? stepByStep.hideStepText : stepByStep.showStepText);
  //   $container.append($button);
  //   return $container;
  // }

  // $("ol.step-list .step").each(function() {
  //   var isVisible = $(this).hasClass('step--active');
  //   var stepTitle = $(this).find('.step__title').text();
  //   if (isVisible) {
  //     $(this).find('.step__summary').addClass('step-show-summary');
  //   }
  //   $(this).find('.step__title').append(stepSummaryButton(isVisible, stepTitle));
  // });

  // // Show / hide all.
  // $('.step-master').on("click", function () {
  //   $('.summaries-control i').toggleClass('fa-eye fa-eye-slash');
  //   if ($(this).text() === stepByStep.showAllText) {
  //     $(this).text(stepByStep.hideAllText).attr('aria-expanded', true);
  //     summaryVisiblity($('.step-show'), 'show');
  //   } else {
  //     $(this).text(stepByStep.showAllText).attr('aria-expanded', false);
  //     summaryVisiblity($('.step-show'), 'hide');
  //   }
  // });

  // // Show / hide single step.
  // $('.step-show').on("click", function () {
  //   $(this).parents('.step').find('.step__summary').toggleClass('step-show-summary');
  //   if ($(this).text() === stepByStep.showStepText) {
  //     summaryVisiblity($(this), 'show');
  //   } else {
  //     summaryVisiblity($(this), 'hide');
  //   }
  // });

})(Drupal);
