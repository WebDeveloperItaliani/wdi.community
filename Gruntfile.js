module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        config: {
            sourceDir: 'src',
            distDir: 'dist',
        },


        //         ******   ********  ********
        //        **////** **//////  **//////
        //       **    // /**       /**
        //      /**       /*********/*********
        //      /**       ////////**////////**
        //      //**    **       /**       /**
        //       //******  ********  ********
        //        //////  ////////  ////////

        less: {
            options: {
                paths: ["<%= config.distDir %>/css"],
                modifyVars: {
                    'bower_components': '"../../bower_components"'
                }
            },
            dev: {
                files: {
                    "<%= config.distDir %>/css/main.css": "<%= config.sourceDir %>/css/main.less"
                }
            },
            prod: {
                options: {
                    cleancss: true,
                    compress: true
                },
                files: {
                    "<%= config.distDir %>/css/main.css": "<%= config.sourceDir %>/css/main.less"
                }
            }
        },

        autoprefixer: {
            options: {
                browsers: [
                    'Android >= 4',
                    'Chrome >= 20',
                    'Firefox >= 24', // Firefox 24 is the latest ESR
                    'Explorer >= 10',
                    'iOS >= 8',
                    'Opera >= 12',
                    'Safari >= 6'
                ]
            },

            main: {
                src: '<%= config.distDir %>/css/main.css',
                dest: '<%= config.distDir %>/css/main.css'
            }
        },

        browserify: {
            dist: {
                options: {
                    transform: [
                        ["babelify", {presets: ["es2015"]}]
                    ]
                },
                files: {
                    "<%= config.distDir %>/js/main.js": "<%= config.sourceDir %>/js/main.js",
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    "<%= config.distDir %>/js/main.min.js": "<%= config.distDir %>/js/main.js",
                }
            }
        },


        //       ****     **** **  ********   ******
        //      /**/**   **/**/** **//////   **////**
        //      /**//** ** /**/**/**        **    //
        //      /** //***  /**/**/*********/**
        //      /**  //*   /**/**////////**/**
        //      /**   /    /**/**       /**//**    **
        //      /**        /**/** ********  //******
        //      //         // // ////////    //////

        clean: ['<%= config.distDir %>/**'],

        connect: {
            server: {
                options: {
                    port: 9001,
                    hostname: '*',
                    base: '<%= config.distDir %>/',
                },
            },
        },

        copy: {
            "static-files": {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.sourceDir %>',
                        src: ['images/**', 'fonts/**', '.htaccess', '*.html', '*.xml'],
                        dest: '<%= config.distDir %>/'
                    },

                    // Font-Awesome
                    {
                        expand: true,
                        cwd: 'node_modules/font-awesome/fonts/',
                        src: '*',
                        dest: '<%= config.distDir %>/fonts'
                    },
                ]
            }
        },

        watch: {
            grunt: {
                files: 'Gruntfile.js',
                tasks: 'build:dev'
            },

            media: {
                files: ['<%= config.sourceDir %>/images/**', '<%= config.sourceDir %>/.htaccess', '<%= config.sourceDir %>/*.html', '<%= config.sourceDir %>/*.xml'],
                tasks: 'copy'
            },

            css: {
                files: '<%= config.sourceDir %>/css/**',
                tasks: ['less:dev', 'autoprefixer']
            },

            js: {
                files: '<%= config.sourceDir %>/js/**',
                tasks: ['browserify']
            },

            options: {
                livereload: true,
            }
        }

    });

    grunt.registerTask('_build', ['clean', 'copy', 'browserify']);

    grunt.registerTask('build:dev', ['_build', 'less:dev', 'autoprefixer']);
    grunt.registerTask('build:prod', ['_build', 'uglify', 'less:prod', 'autoprefixer']);

    grunt.registerTask('server', ['connect', 'watch']);

    grunt.registerTask('default', ['build:dev', 'server']);
};
