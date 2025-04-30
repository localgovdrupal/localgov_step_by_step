/**
 * @file
 * Additional behaviour for the Step by step navigation.
 */

(function (Drupal) {
  Drupal.behaviors.stepByStepNav = {
    attach(context) {
      /**
       * Toggles the state of the control button.
       *
       * @param {boolean} pressed
       */
      function toggleControlButton(pressed) {
        stepControlButton.innerHTML = Drupal.theme.controlButtonText(pressed);
        stepControlButton.setAttribute("aria-pressed", pressed);

        if (stepControlIcon && pressed) {
          stepControlIcon.classList.add(stepControlIcon.dataset.pressedClass);
          stepControlIcon.classList.remove(
            stepControlIcon.dataset.unpressedClass,
          );
        } else if (stepControlIcon && !pressed) {
          stepControlIcon.classList.add(stepControlIcon.dataset.unpressedClass);
          stepControlIcon.classList.remove(
            stepControlIcon.dataset.pressedClass,
          );
        }
      }

      /**
       * Handle clicks on individual step buttons.
       *
       * @param {object} step
       *   A simple object containing button, link, summary, and title of a
       *   given step.
       */
      function handleControlButtonClick({ currentTarget, target }) {
        let message, pressed;

        if (currentTarget !== target) {
          return;
        }

        pressed = target.getAttribute("aria-pressed") !== "true";
        toggleControlButton(pressed);
        steps.forEach((step) => {
          if (step.button.getAttribute("aria-expanded") !== String(pressed)) {
            toggleStepButton(step, pressed);
          }
        });
        // Ensure focus stays with button.
        target.focus();

        if (pressed) {
          message = Drupal.t('Step summaries expanded');
        } else {
          message = Drupal.t('Step summaries collapsed');
        }

        Drupal.announce(message);
      }

      /**
       * Toggles the state of a step button.
       *
       * @param {object} step
       *   A simple object containing button, link, summary, and title of a
       *   given step.
       */
      function toggleStepButton({ button, summary, title }, expanded) {
        let ariaLabel;

        if (expanded) {
          ariaLabel = Drupal.t("Hide step summary - !stepTitle", {
            "!stepTitle": title,
          });
        } else {
          ariaLabel = Drupal.t("Show step summary - !stepTitle", {
            "!stepTitle": title,
          });
        }

        button.innerHTML = Drupal.theme("stepButtonText", expanded);
        button.setAttribute("aria-expanded", expanded);
        button.setAttribute("aria-label", ariaLabel);
        summary.classList[expanded ? "add" : "remove"]("step-show-summary");
      }

      /**
       * Handle clicks on Show/Hide all summaries button.
       *
       * @param {Event} event
       *   The event object passed in by the listener.
       */
      function handleStepButtonClick({ currentTarget, target }) {
        let stepIndex, hiddenSteps;

        if (currentTarget !== target) {
          return;
        }

        stepIndex = steps.findIndex((step) => step.button === target);
        toggleStepButton(
          steps[stepIndex],
          target.getAttribute("aria-expanded") !== "true",
        );
        hiddenSteps = !!steps.filter(
          (step) => step.button.getAttribute("aria-expanded") === "false",
        ).length;

        // 'Show all' control displayed if any steps are hidden, and 'Hide all'
        // control displayed otherwise.
        toggleControlButton(!hiddenSteps);
      }

      // Set up interactivity.

      const [stepListEl] = once("sts-steplist", "ol.step-list", context);
      const steps = [];
      let stepButtonTemplate,
        stepControlButton,
        stepControlIcon,
        stepControlMarkup,
        stepControlTemplate,
        stepEls,
        stepListParentEl;

      if (!stepListEl) {
        return;
      }

      stepListParentEl = stepListEl.parentElement;
      stepEls = once("sts-step", ".step", stepListEl);

      // Set up master control button.
      stepControlTemplate = document.createElement("template");
      stepControlTemplate.innerHTML = Drupal.theme("controlButtonHtml");
      stepControlMarkup = stepControlTemplate.content.cloneNode(true);
      stepControlButton = stepControlMarkup.querySelector("button");
      stepControlIcon = stepControlMarkup.querySelector("i.fas");

      // Insert button into DOM.
      stepListParentEl.prepend(stepControlMarkup);

      // Populate button.
      toggleControlButton(false);

      // Add button event listener.
      stepControlButton.addEventListener("click", handleControlButtonClick);

      // Set up step buttons.
      stepButtonTemplate = document.createElement("template");
      stepButtonTemplate.innerHTML = Drupal.theme("stepButtonHtml");
      stepEls.forEach((stepEl) => {
        const buttonMarkup = stepButtonTemplate.content.cloneNode(true);
        const stepTitleEl = stepEl.querySelector(".step__title");
        const step = {};

        step.button = buttonMarkup.querySelector("button");
        step.link = stepEl.querySelector("a[href]");
        step.summary = stepEl.querySelector(".step__summary");
        step.title = stepTitleEl.textContent.trim();

        // Insert button into DOM.
        stepTitleEl.append(buttonMarkup);

        // Populate button.
        toggleStepButton(step, false);

        // Add button event listener.
        step.button.addEventListener("click", handleStepButtonClick);

        // Cache each step for later use.
        steps.push(step);
      });
    },
  };
})(Drupal);
