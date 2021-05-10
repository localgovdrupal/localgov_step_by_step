<?php

namespace Drupal\Tests\localgov_step_by_step\Functional;

use Drupal\node\NodeInterface;
use Drupal\taxonomy\Entity\Vocabulary;
use Drupal\Tests\BrowserTestBase;
use Drupal\Tests\node\Traits\NodeCreationTrait;
use Drupal\Tests\system\Functional\Menu\AssertBreadcrumbTrait;
use Drupal\Tests\taxonomy\Traits\TaxonomyTestTrait;

/**
 * Tests pages working together with pathauto, services and topics.
 *
 * @group localgov_step_by_step
 */
class PagesIntegrationTest extends BrowserTestBase {

  use NodeCreationTrait;
  use AssertBreadcrumbTrait;
  use TaxonomyTestTrait;

  /**
   * Test breadcrumbs in the Standard profile.
   *
   * @var string
   */
  protected $profile = 'standard';

  /**
   * A user with permission to bypass content access checks.
   *
   * @var \Drupal\user\UserInterface
   */
  protected $adminUser;

  /**
   * The node storage.
   *
   * @var \Drupal\node\NodeStorageInterface
   */
  protected $nodeStorage;

  /**
   * Modules to enable.
   *
   * @var array
   */
  protected static $modules = [
    'localgov_core',
    'localgov_services_landing',
    'localgov_services_sublanding',
    'localgov_services_navigation',
    'localgov_topics',
    'localgov_step_by_step',
  ];

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    $this->adminUser = $this->drupalCreateUser([
      'bypass node access',
      'administer nodes',
    ]);
    $this->nodeStorage = $this->container->get('entity_type.manager')->getStorage('node');
  }

  /**
   * Post overview into a topic.
   */
  public function testTopicIntegration() {
    $vocabulary = Vocabulary::load('localgov_topic');
    $term = $this->createTerm($vocabulary);

    $this->drupalLogin($this->adminUser);
    $this->drupalGet('node/add/localgov_step_by_step_overview');
    $form = $this->getSession()->getPage();
    $form->fillField('edit-title-0-value', 'Step by Step 1');
    $form->fillField('edit-body-0-summary', 'Step by Step 1 summary');
    $form->fillField('edit-body-0-value', 'Step by Step 1 description');
    $form->fillField('edit-localgov-topic-classified-0-target-id', "({$term->id()})");
    $form->checkField('edit-status-value');
    $form->pressButton('edit-submit');
  }

  /**
   * Post overview into a service.
   */
  public function testServicesIntegration() {
    $landing = $this->createNode([
      'title' => 'Landing Page 1',
      'type' => 'localgov_services_landing',
      'status' => NodeInterface::PUBLISHED,
    ]);
    $sublanding = $this->createNode([
      'title' => 'Sublanding 1',
      'type' => 'localgov_services_sublanding',
      'status' => NodeInterface::PUBLISHED,
      'localgov_services_parent' => ['target_id' => $landing->id()],
    ]);

    $this->drupalLogin($this->adminUser);
    $this->drupalGet('node/add/localgov_step_by_step_overview');
    $form = $this->getSession()->getPage();
    $form->fillField('edit-title-0-value', 'Step by Step 1');
    $form->fillField('edit-body-0-summary', 'Step by Step 1 summary');
    $form->fillField('edit-body-0-value', 'Step by Step 1 description');
    $form->fillField('edit-localgov-services-parent-0-target-id', "Sublanding 1 ({$sublanding->id()})");
    $form->checkField('edit-status-value');
    $form->pressButton('edit-submit');

    $this->assertSession()->pageTextContains('Step by Step 1');
    $trail = ['' => 'Home'];
    $trail += ['landing-page-1' => 'Landing Page 1'];
    $trail += ['landing-page-1/sublanding-1' => 'Sublanding 1'];
    $this->assertBreadcrumb(NULL, $trail);
  }

  /**
   * Pathauto and breadcrumbs.
   */
  public function testPagePath() {
    $overview = $this->createNode([
      'title' => 'Overview 1',
      'type' => 'localgov_step_by_step_overview',
      'status' => NodeInterface::PUBLISHED,
    ]);
    $this->createNode([
      'title' => 'Page 1',
      'type' => 'localgov_step_by_step_page',
      'status' => NodeInterface::PUBLISHED,
      'localgov_step_parent' => ['target_id' => $overview->id()],
    ]);

    $this->drupalGet('step-by-step/overview-1/page-1');
    $this->assertSession()->pageTextContains('Page 1');
    $trail = ['' => 'Home'];
    $trail += ['step-by-step/overview-1' => 'Overview 1'];
    $this->assertBreadcrumb(NULL, $trail);
  }

}
