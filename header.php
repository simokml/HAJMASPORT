<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
    
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header">
    <div class="container">
        <div class="site-logo">
            <?php if (has_custom_logo()) : ?>
                <?php the_custom_logo(); ?>
            <?php else : ?>
                <h1>
                    <a href="<?php echo esc_url(home_url('/')); ?>" rel="home">
                        <?php bloginfo('name'); ?>
                    </a>
                </h1>
                <?php 
                $description = get_bloginfo('description', 'display');
                if ($description || is_customize_preview()) : ?>
                    <span><?php echo $description; ?></span>
                <?php endif; ?>
            <?php endif; ?>
        </div>
        
        <nav class="main-navigation">
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'menu_id'        => 'primary-menu',
                'fallback_cb'    => 'hajmasport_default_menu',
            ));
            ?>
        </nav>
        
        <div class="social-links">
            <?php if (get_theme_mod('telegram_url')) : ?>
                <a href="<?php echo esc_url(get_theme_mod('telegram_url')); ?>" class="social-link telegram" target="_blank">T</a>
            <?php endif; ?>
            
            <?php if (get_theme_mod('twitter_url')) : ?>
                <a href="<?php echo esc_url(get_theme_mod('twitter_url')); ?>" class="social-link twitter" target="_blank">X</a>
            <?php endif; ?>
            
            <?php if (get_theme_mod('youtube_url')) : ?>
                <a href="<?php echo esc_url(get_theme_mod('youtube_url')); ?>" class="social-link youtube" target="_blank">Y</a>
            <?php endif; ?>
            
            <?php if (get_theme_mod('facebook_url')) : ?>
                <a href="<?php echo esc_url(get_theme_mod('facebook_url')); ?>" class="social-link facebook" target="_blank">F</a>
            <?php endif; ?>
            
            <?php if (get_theme_mod('instagram_url')) : ?>
                <a href="<?php echo esc_url(get_theme_mod('instagram_url')); ?>" class="social-link instagram" target="_blank">I</a>
            <?php endif; ?>
        </div>
    </div>
</header>

<?php if (is_home() || is_front_page()) : ?>
<nav class="nav-tabs">
    <div class="container">
        <button class="tab-btn active" data-tab="today"><?php _e('مباريات اليوم', 'hajmasport'); ?></button>
        <button class="tab-btn" data-tab="live"><?php _e('مباريات مباشرة', 'hajmasport'); ?></button>
        <button class="tab-btn" data-tab="tomorrow"><?php _e('مباريات الغد', 'hajmasport'); ?></button>
    </div>
</nav>
<?php endif; ?>