<?php
/**
 * HAJMASPORT functions and definitions
 *
 * @package HAJMASPORT
 */

// منع الوصول المباشر
if (!defined('ABSPATH')) {
    exit;
}

/**
 * إعداد القالب
 */
function hajmasport_setup() {
    // دعم الترجمة
    load_theme_textdomain('hajmasport', get_template_directory() . '/languages');
    
    // دعم RSS feeds
    add_theme_support('automatic-feed-links');
    
    // دعم عنوان الصفحة
    add_theme_support('title-tag');
    
    // دعم الصور المميزة
    add_theme_support('post-thumbnails');
    
    // دعم HTML5
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    
    // دعم الشعار المخصص
    add_theme_support('custom-logo', array(
        'height'      => 250,
        'width'       => 250,
        'flex-width'  => true,
        'flex-height' => true,
    ));
    
    // دعم الخلفية المخصصة
    add_theme_support('custom-background', array(
        'default-color' => '141414',
        'default-image' => '',
    ));
    
    // تسجيل القوائم
    register_nav_menus(array(
        'primary' => __('القائمة الرئيسية', 'hajmasport'),
        'footer'  => __('قائمة الفوتر', 'hajmasport'),
    ));
    
    // أحجام الصور المخصصة
    add_image_size('hajmasport-featured', 800, 450, true);
    add_image_size('hajmasport-thumbnail', 300, 200, true);
}
add_action('after_setup_theme', 'hajmasport_setup');

/**
 * تسجيل وتحميل الملفات
 */
function hajmasport_scripts() {
    // تحميل ملف CSS الرئيسي
    wp_enqueue_style('hajmasport-style', get_stylesheet_uri(), array(), '1.0.0');
    
    // تحميل خط Cairo من Google Fonts
    wp_enqueue_style('hajmasport-fonts', 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap', array(), null);
    
    // تحميل JavaScript للتعليقات
    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
    
    // تحميل JavaScript مخصص
    wp_enqueue_script('hajmasport-script', get_template_directory_uri() . '/js/main.js', array('jquery'), '1.0.0', true);
    
    // تمرير متغيرات PHP إلى JavaScript
    wp_localize_script('hajmasport-script', 'hajmasport_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('hajmasport_nonce'),
    ));
}
add_action('wp_enqueue_scripts', 'hajmasport_scripts');

/**
 * تسجيل مناطق الودجات
 */
function hajmasport_widgets_init() {
    register_sidebar(array(
        'name'          => __('الشريط الجانبي', 'hajmasport'),
        'id'            => 'sidebar-1',
        'description'   => __('إضافة ودجات للشريط الجانبي', 'hajmasport'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));
    
    // فوتر ودجات
    for ($i = 1; $i <= 3; $i++) {
        register_sidebar(array(
            'name'          => sprintf(__('فوتر %d', 'hajmasport'), $i),
            'id'            => 'footer-' . $i,
            'description'   => sprintf(__('إضافة ودجات لمنطقة الفوتر %d', 'hajmasport'), $i),
            'before_widget' => '<div id="%1$s" class="widget %2$s">',
            'after_widget'  => '</div>',
            'before_title'  => '<h3 class="widget-title">',
            'after_title'   => '</h3>',
        ));
    }
}
add_action('widgets_init', 'hajmasport_widgets_init');

/**
 * قائمة افتراضية
 */
function hajmasport_default_menu() {
    echo '<ul id="primary-menu">';
    echo '<li><a href="' . esc_url(home_url('/')) . '">' . __('الرئيسية', 'hajmasport') . '</a></li>';
    echo '<li><a href="' . esc_url(home_url('/matches/')) . '">' . __('المباريات', 'hajmasport') . '</a></li>';
    echo '<li><a href="' . esc_url(home_url('/news/')) . '">' . __('الأخبار', 'hajmasport') . '</a></li>';
    echo '<li><a href="' . esc_url(home_url('/contact/')) . '">' . __('اتصل بنا', 'hajmasport') . '</a></li>';
    echo '</ul>';
}

/**
 * إعدادات المخصص (Customizer)
 */
function hajmasport_customize_register($wp_customize) {
    // قسم إعدادات API
    $wp_customize->add_section('hajmasport_api_settings', array(
        'title'    => __('إعدادات API', 'hajmasport'),
        'priority' => 30,
    ));
    
    // مفتاح API
    $wp_customize->add_setting('api_key', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('api_key', array(
        'label'   => __('مفتاح API', 'hajmasport'),
        'section' => 'hajmasport_api_settings',
        'type'    => 'text',
    ));
    
    // رابط API الأساسي
    $wp_customize->add_setting('api_base_url', array(
        'default'           => 'https://api.sportmonks.com/v3',
        'sanitize_callback' => 'esc_url_raw',
    ));
    
    $wp_customize->add_control('api_base_url', array(
        'label'   => __('رابط API الأساسي', 'hajmasport'),
        'section' => 'hajmasport_api_settings',
        'type'    => 'url',
    ));
    
    // معرف الفريق
    $wp_customize->add_setting('team_id', array(
        'default'           => '3468',
        'sanitize_callback' => 'absint',
    ));
    
    $wp_customize->add_control('team_id', array(
        'label'   => __('معرف الفريق', 'hajmasport'),
        'section' => 'hajmasport_api_settings',
        'type'    => 'number',
    ));
    
    // قسم وسائل التواصل الاجتماعي
    $wp_customize->add_section('hajmasport_social_settings', array(
        'title'    => __('وسائل التواصل الاجتماعي', 'hajmasport'),
        'priority' => 35,
    ));
    
    // روابط وسائل التواصل
    $social_networks = array(
        'facebook'  => __('فيسبوك', 'hajmasport'),
        'twitter'   => __('تويتر', 'hajmasport'),
        'instagram' => __('إنستغرام', 'hajmasport'),
        'youtube'   => __('يوتيوب', 'hajmasport'),
        'telegram'  => __('تيليغرام', 'hajmasport'),
    );
    
    foreach ($social_networks as $network => $label) {
        $wp_customize->add_setting($network . '_url', array(
            'default'           => '',
            'sanitize_callback' => 'esc_url_raw',
        ));
        
        $wp_customize->add_control($network . '_url', array(
            'label'   => $label,
            'section' => 'hajmasport_social_settings',
            'type'    => 'url',
        ));
    }
}
add_action('customize_register', 'hajmasport_customize_register');

/**
 * إضافة دعم للغة العربية
 */
function hajmasport_rtl_support() {
    if (is_rtl()) {
        wp_enqueue_style('hajmasport-rtl', get_template_directory_uri() . '/rtl.css', array('hajmasport-style'), '1.0.0');
    }
}
add_action('wp_enqueue_scripts', 'hajmasport_rtl_support');

/**
 * تخصيص طول المقتطف
 */
function hajmasport_excerpt_length($length) {
    return 30;
}
add_filter('excerpt_length', 'hajmasport_excerpt_length');

/**
 * تخصيص نهاية المقتطف
 */
function hajmasport_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'hajmasport_excerpt_more');

/**
 * إضافة فئات CSS لـ body
 */
function hajmasport_body_classes($classes) {
    if (!is_singular()) {
        $classes[] = 'hfeed';
    }
    
    if (is_rtl()) {
        $classes[] = 'rtl';
    }
    
    return $classes;
}
add_filter('body_class', 'hajmasport_body_classes');

/**
 * تحسين الأمان
 */
function hajmasport_security_headers() {
    if (!is_admin()) {
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: SAMEORIGIN');
        header('X-XSS-Protection: 1; mode=block');
    }
}
add_action('send_headers', 'hajmasport_security_headers');

/**
 * إزالة معلومات الإصدار من WordPress
 */
remove_action('wp_head', 'wp_generator');

/**
 * تحسين الأداء - إزالة الملفات غير المطلوبة
 */
function hajmasport_cleanup_head() {
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'wp_shortlink_wp_head');
}
add_action('init', 'hajmasport_cleanup_head');