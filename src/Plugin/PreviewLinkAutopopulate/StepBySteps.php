<?php

namespace Drupal\localgov_step_by_step\Plugin\PreviewLinkAutopopulate;

use Drupal\node\NodeInterface;
use Drupal\preview_link\PreviewLinkAutopopulatePluginBase;

/**
 * Auto-populate Step-by-step preview links.
 *
 * @PreviewLinkAutopopulate(
 *   id = "localgov_step_by_step",
 *   label = @Translation("Add all the pages for this step by step"),
 *   description = @Translation("Add step by step overview and page nodes to preview link."),
 *   supported_entities = {
 *     "node" = {
 *       "localgov_step_by_step_overview",
 *       "localgov_step_by_step_page",
 *     }
 *   },
 * )
 */
class StepBySteps extends PreviewLinkAutopopulatePluginBase {

  /**
   * {@inheritdoc}
   */
  public function getPreviewEntities(): array {
    $overview = NULL;
    $step_by_step_nodes = [];

    // Find step-by-step overview.
    $node = $this->getEntity();
    if ($node->bundle() == 'localgov_step_by_step_overview') {
      $overview = $node;
    }
    elseif ($node->bundle() == 'localgov_step_by_step_page') {
      $overview = $node->get('localgov_step_parent')->entity;
    }

    if ($overview instanceof NodeInterface) {
      $step_by_step_nodes[] = $overview;

      // Find step-by-step pages.
      $pages = $overview->get('localgov_step_by_step_pages')->referencedEntities();
      foreach ($pages as $page) {
        if ($page instanceof NodeInterface && $page->access('view')) {
          $step_by_step_nodes[] = $page;
        }
      }
    }

    return $step_by_step_nodes;
  }

}
