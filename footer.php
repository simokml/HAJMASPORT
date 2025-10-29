<footer class="site-footer">
    <div class="container">
        <?php if (is_active_sidebar('footer-1') || is_active_sidebar('footer-2') || is_active_sidebar('footer-3')) : ?>
            <div class="footer-widgets">
                <?php if (is_active_sidebar('footer-1')) : ?>
                    <div class="footer-widget">
                        <?php dynamic_sidebar('footer-1'); ?>
                    </div>
                <?php endif; ?>
                
                <?php if (is_active_sidebar('footer-2')) : ?>
                    <div class="footer-widget">
                        <?php dynamic_sidebar('footer-2'); ?>
                    </div>
                <?php endif; ?>
                
                <?php if (is_active_sidebar('footer-3')) : ?>
                    <div class="footer-widget">
                        <?php dynamic_sidebar('footer-3'); ?>
                    </div>
                <?php endif; ?>
            </div>
        <?php endif; ?>
        
        <div class="site-info">
            <p>
                &copy; <?php echo date('Y'); ?> 
                <a href="<?php echo esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a>. 
                <?php _e('جميع الحقوق محفوظة.', 'hajmasport'); ?>
            </p>
            <p>
                <?php _e('مدعوم بواسطة', 'hajmasport'); ?> 
                <a href="https://wordpress.org/" target="_blank">WordPress</a>
            </p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>

<!-- تضمين ملفات JavaScript للمباريات -->
<?php if (is_home() || is_front_page()) : ?>
    <script>
        // إعدادات API من ووردبريس
        const API_CONFIG = {
            baseUrl: '<?php echo esc_js(get_theme_mod('api_base_url', 'https://api.sportmonks.com/v3')); ?>',
            apiKey: '<?php echo esc_js(get_theme_mod('api_key', '')); ?>',
            teamId: <?php echo esc_js(get_theme_mod('team_id', '3468')); ?>,
            includes: 'participants,league,scores,state',
            limit: 50
        };
        
        // قائمة القنوات
        const CHANNELS = [
            '<?php _e('beIN Sports 1 HD', 'hajmasport'); ?>',
            '<?php _e('beIN Sports 2 HD', 'hajmasport'); ?>',
            '<?php _e('beIN Sports 3 HD', 'hajmasport'); ?>',
            '<?php _e('beIN Sports 4 HD', 'hajmasport'); ?>',
            '<?php _e('SSC Sports 1', 'hajmasport'); ?>',
            '<?php _e('SSC Sports 2', 'hajmasport'); ?>'
        ];
        
        // ترجمة أسماء الفرق
        const TEAM_TRANSLATIONS = {
            'Real Madrid': '<?php _e('ريال مدريد', 'hajmasport'); ?>',
            'Barcelona': '<?php _e('برشلونة', 'hajmasport'); ?>',
            'FC Barcelona': '<?php _e('برشلونة', 'hajmasport'); ?>',
            'Manchester United': '<?php _e('مانشستر يونايتد', 'hajmasport'); ?>',
            'Manchester City': '<?php _e('مانشستر سيتي', 'hajmasport'); ?>',
            'Liverpool': '<?php _e('ليفربول', 'hajmasport'); ?>',
            'Chelsea': '<?php _e('تشيلسي', 'hajmasport'); ?>',
            'Arsenal': '<?php _e('أرسنال', 'hajmasport'); ?>',
            'Atletico Madrid': '<?php _e('أتلتيكو مدريد', 'hajmasport'); ?>',
            'Valencia': '<?php _e('فالنسيا', 'hajmasport'); ?>'
        };
        
        // ترجمة أسماء الدوريات
        const LEAGUE_TRANSLATIONS = {
            'Premier League': '<?php _e('الدوري الإنجليزي الممتاز', 'hajmasport'); ?>',
            'La Liga': '<?php _e('الدوري الإسباني', 'hajmasport'); ?>',
            'Serie A': '<?php _e('الدوري الإيطالي', 'hajmasport'); ?>',
            'Bundesliga': '<?php _e('الدوري الألماني', 'hajmasport'); ?>',
            'Ligue 1': '<?php _e('الدوري الفرنسي', 'hajmasport'); ?>',
            'Champions League': '<?php _e('دوري أبطال أوروبا', 'hajmasport'); ?>'
        };
    </script>
    <script src="<?php echo get_template_directory_uri(); ?>/js/matches.js"></script>
<?php endif; ?>

</body>
</html>