<?php
/**
 * The sidebar containing the main widget area
 *
 * @package HAJMASPORT
 */

if (!is_active_sidebar('sidebar-1')) {
    return;
}
?>

<aside class="sidebar widget-area">
    <?php dynamic_sidebar('sidebar-1'); ?>
</aside>