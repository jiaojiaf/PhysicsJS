define([
    
    'jquery',
    'physicsjs'

], function(
    $,
    Physics
){
    return Physics({

        // config
        timestep: 1000 / 160

    }, function( world ){

        world.title = "Mixed Shape Collision";

        var pent = [
                { x: 50, y: 0 },
                { x: 25, y: -25 },
                { x: -25, y: -25 },
                { x: -50, y: 0 },
                { x: 0, y: 50 }
            ];

        var $win = $(window)
            ,viewWidth = $win.width()
            ,viewHeight = $win.height()
            ,viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight)
            ,edgeBounce = Physics.behavior('edge-collision-detection', {
                aabb: viewportBounds,
                restitution: 0.4,
                cof: 0.5
            })
            ;

        function dropInBody(){

            var body;

            switch ( Physics.util.random( 2 ) | 0 ){

                // add a circle
                case 0:
                    body = Physics.body('circle', {
                        x: viewWidth / 2,
                        y: 50,
                        vx: Physics.util.random(-5, 5)/100,
                        radius: 40,
                        restitution: 0.9
                    });
                break;

                // add a square
                case 1:
                    body = Physics.body('convex-polygon', {
                        vertices: [
                            {x: 0, y: 50},
                            {x: 50, y: 50},
                            {x: 50, y: 0},
                            {x: 0, y: 0}
                        ],
                        x: viewWidth / 2,
                        y: 50,
                        vx: Physics.util.random(-5, 5)/100,
                        restitution: 0.9
                    });
                break;

                // add a polygon
                case 2:
                    body = Physics.body('convex-polygon', {
                        vertices: pent,
                        x: viewWidth / 2,
                        y: 50,
                        vx: Physics.util.random(-5, 5)/100,
                        angle: Physics.util.random( 2 * Math.PI ),
                        restitution: 0.9
                    });
                break;
            }

            world.add( body );
        }
            
        var dropCount = 0;
        function dropDelay(){

            if (dropCount++ < 80){

                if ( !world.isPaused() ){
                    dropInBody();
                }

                setTimeout(dropDelay, 1500);
            }
        }
        
        dropDelay();
        
        $(window).on('resize', function(){

            viewWidth = $win.width();
            viewHeight = $win.height();
            viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);
            edgeBounce.setAABB( viewportBounds );

        }).trigger('resize');

        world.add( Physics.behavior('body-collision-detection', { checkAll: false }) );
        world.add( Physics.behavior('sweep-prune') );
        world.add( Physics.behavior('body-impulse-response') );

        world.add( edgeBounce );
        world.add( Physics.behavior('body-impulse-response') );

        // add gravity
        world.add( Physics.behavior('constant-acceleration') );
    });   
});