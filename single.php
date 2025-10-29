<?php
/**
 * The template for displaying all single posts
 *
 * @package HAJMASPORT
 */

get_header(); ?>

<main class="main-content">
    <div class="container">
        <div class="content-area">
            <?php while (have_posts()) : the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class('single-post'); ?>>
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="post-thumbnail">
                            <?php the_post_thumbnail('hajmasport-featured'); ?>
                        </div>
                    <?php endif; ?>
                    
                    <header class="entry-header">
                        <h1 class="entry-title"><?php the_title(); ?></h1>
                        
                        <div class="entry-meta">
                            <span class="posted-on">
                                <time datetime="<?php echo get_the_date('c'); ?>">
                                    <?php echo get_the_date(); ?>
                                </time>
                            </span>
                            
                            <span class="byline">
                                <?php _e('بواسطة', 'hajmasport'); ?> 
                                <a href="<?php echo esc_url(get_author_posts_url(get_the_author_meta('ID'))); ?>">
                                    <?php the_author(); ?>
                                </a>
                            </span>
                            
                            <?php if (has_category()) : ?>
                                <span class="cat-links">
                                    <?php _e('في', 'hajmasport'); ?> <?php the_category(', '); ?>
                                </span>
                            <?php endif; ?>
                            
                            <?php if (comments_open() || get_comments_number()) : ?>
                                <span class="comments-link">
                                    <a href="<?php comments_link(); ?>">
                                        <?php
                                        printf(
                                            _nx('تعليق واحد', '%1$s تعليقات', get_comments_number(), 'comments title', 'hajmasport'),
                                            number_format_i18n(get_comments_number())
                                        );
                                        ?>
                                    </a>
                                </span>
                            <?php endif; ?>
                        </div>
                    </header>
                    
                    <div class="entry-content">
                        <?php
                        the_content();
                        
                        wp_link_pages(array(
                            'before' => '<div class="page-links">' . __('الصفحات:', 'hajmasport'),
                            'after'  => '</div>',
                        ));
                        ?>
                    </div>
                    
                    <footer class="entry-footer">
                        <?php if (has_tag()) : ?>
                            <div class="tags-links">
                                <strong><?php _e('الوسوم:', 'hajmasport'); ?></strong>
                                <?php the_tags('', ', ', ''); ?>
                            </div>
                        <?php endif; ?>
                        
                        <div class="post-navigation">
                            <?php
                            the_post_navigation(array(
                                'prev_text' => '<span class="nav-subtitle">' . __('المقال السابق:', 'hajmasport') . '</span> <span class="nav-title">%title</span>',
                                'next_text' => '<span class="nav-subtitle">' . __('المقال التالي:', 'hajmasport') . '</span> <span class="nav-title">%title</span>',
                            ));
                            ?>
                        </div>
                    </footer>
                </article>
                
                <?php
                // If comments are open or we have at least one comment, load up the comment template.
                if (comments_open() || get_comments_number()) :
                    comments_template();
                endif;
                ?>
                
            <?php endwhile; ?>
        </div>
    </div>
</main>

<?php get_sidebar(); ?>
<?php get_footer(); ?>