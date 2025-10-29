<?php
/**
 * The main template file
 *
 * @package HAJMASPORT
 */

get_header(); ?>

<main class="main-content">
    <div class="container">
        <?php if (have_posts()) : ?>
            
            <!-- عرض المباريات إذا كانت الصفحة الرئيسية -->
            <?php if (is_home() || is_front_page()) : ?>
                <div class="api-notice" id="api-notice" style="display: none;">
                    <div style="background: #333; color: #e50914; padding: 10px; border-radius: 5px; margin-bottom: 20px; text-align: center; font-size: 14px;">
                        📡 يتم عرض بيانات تجريبية. لعرض المباريات الحقيقية، يرجى إضافة مفتاح API في إعدادات القالب
                    </div>
                </div>
                
                <div class="matches-section">
                    <div class="section-header">
                        <h2><?php _e('جدول المباريات', 'hajmasport'); ?></h2>
                    </div>
                    
                    <div class="matches-container" id="matches-container">
                        <!-- المباريات ستُضاف هنا بواسطة JavaScript -->
                    </div>
                </div>
            <?php endif; ?>
            
            <!-- عرض المقالات العادية -->
            <div class="posts-container">
                <?php while (have_posts()) : the_post(); ?>
                    <article id="post-<?php the_ID(); ?>" <?php post_class('post-card'); ?>>
                        <?php if (has_post_thumbnail()) : ?>
                            <div class="post-thumbnail">
                                <a href="<?php the_permalink(); ?>">
                                    <?php the_post_thumbnail('large'); ?>
                                </a>
                            </div>
                        <?php endif; ?>
                        
                        <div class="post-content">
                            <header class="entry-header">
                                <h2 class="entry-title">
                                    <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                </h2>
                                
                                <div class="entry-meta">
                                    <span class="posted-on">
                                        <?php echo get_the_date(); ?>
                                    </span>
                                    <span class="byline">
                                        <?php _e('بواسطة', 'hajmasport'); ?> <?php the_author(); ?>
                                    </span>
                                </div>
                            </header>
                            
                            <div class="entry-summary">
                                <?php the_excerpt(); ?>
                            </div>
                            
                            <footer class="entry-footer">
                                <a href="<?php the_permalink(); ?>" class="read-more">
                                    <?php _e('قراءة المزيد', 'hajmasport'); ?>
                                </a>
                            </footer>
                        </div>
                    </article>
                <?php endwhile; ?>
                
                <!-- Pagination -->
                <div class="pagination">
                    <?php
                    the_posts_pagination(array(
                        'prev_text' => __('السابق', 'hajmasport'),
                        'next_text' => __('التالي', 'hajmasport'),
                    ));
                    ?>
                </div>
            </div>
            
        <?php else : ?>
            <div class="no-content">
                <h2><?php _e('لا توجد مقالات', 'hajmasport'); ?></h2>
                <p><?php _e('عذراً، لا توجد مقالات متاحة حالياً.', 'hajmasport'); ?></p>
            </div>
        <?php endif; ?>
    </div>
</main>

<?php get_sidebar(); ?>
<?php get_footer(); ?>