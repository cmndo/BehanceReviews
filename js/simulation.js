//ps.$('.draw').onmousemove({clientX:500, clientY:500});



(function($){
    $(function(){
        console.log("Loaded and Ready");


        var slideImages = [
            {
                image: "img/intro.png",
                ptlGap: 3,
                ptlSize: 3,
                dataURI: "",
                slideTime: 8000,
                direction: "left",
                offset: 8000
            },
            {
                image: "img/connect.png",
                ptlGap: 1,
                ptlSize: 2,
                dataURI: "",
                slideTime: 8000,
                direction: "left",
                offset: 150
            },
            {
                image: "img/share.png",
                ptlGap: 1,
                ptlSize: 2,
                dataURI: "",
                slideTime: 8000,
                direction: "right",
                offset: 100
            },
            {
                image: "img/feedback.png",
                ptlGap: 1,
                ptlSize: 2,
                dataURI: "",
                slideTime: 8000,
                direction: "right",
                offset: 200
            },
            {
                image: "img/Be.png",
                ptlGap: 7,
                ptlSize: 5,
                dataURI: "",
                slideTime: 8000,
                direction: "left",
                offset: 0
            },
            {
                image: "img/hash_be.png",
                ptlGap: 2,
                ptlSize: 3,
                dataURI: "",
                slideTime: 8000,
                direction: "left",
                offset: 1920
            },
            {
                image: "img/hash_ds.png",
                ptlGap: 2,
                ptlSize: 3,
                dataURI: "",
                slideTime: 8000,
                direction: "left",
                offset: 1920
            },
            {
                image: "img/hostedby.png",
                ptlGap: 1,
                ptlSize: 2,
                dataURI: "",
                slideTime: 8000,
                direction: "left",
                offset: 0
            },
            {
                image: "img/stamp.png",
                ptlGap: 1,
                ptlSize: 2,
                dataURI: "",
                slideTime: 8000,
                direction: "right",
                offset: -500
            }
        ],
        tmpCanvas = document.createElement('canvas'),
        tmpContext = tmpCanvas.getContext('2d'),
        $slides = $('.slides');

        //load those images and send them to be processed
        var lastCompletedNum = 0;

        function loadNext(){

            var img = new Image();
            img.onload = function(){

                console.log("attempting to load " + lastCompletedNum + ". That file is " + slideImages[lastCompletedNum].image);

                tmpCanvas.width = this.width;
                tmpCanvas.height = this.height;
    	        tmpContext.drawImage(this, 0, 0);
                slideImages[lastCompletedNum].dataURI = tmpCanvas.toDataURL();

                if(lastCompletedNum === slideImages.length - 1){
                    buildDOM();
                }else{
                    lastCompletedNum++;
                    loadNext();
                }
            }
            img.src = slideImages[lastCompletedNum].image;

        }

        //start loading them in order
        loadNext();


        //set up the DOM before we start doing any particle work
        function buildDOM(){
            for(var d = 0; d < slideImages.length; d++){
                $slides.append("<div data-src='"+slideImages[d].dataURI+"' class='slide'></div>");
            }
            initParticles();
        }

        //set up the particle simulation
        function initParticles(){

            ps = new ParticleSlider({
                ptlGap: 3,
                ptlSize: 3,
              width: 1e9,
              height: 1e9
            });

            ps.restless = true;
            ps.slideDelay = 0;


            startSimulation(ps);

        }



        function runMouseThrough(direction, offset){

            var my = ($('body').height() / 2) - 20, mwidth = $(window).width(), mx, running, speed = 35;


                if(direction == "left"){
                    mx = mwidth - offset;
                    running = setInterval(stepLeft, 15);
                }else{
                    mx = offset;
                    running = setInterval(stepRight, 15);
                }



                function stepLeft(){
                    mx -= speed;
                    if(mx < 0){
                        clearInterval(running);
                        ps.$('.draw').onmouseout();
                    }else{
                        ps.$('.draw').onmousemove({clientX:mx, clientY:my});
                    }
                }
                function stepRight(){
                    mx += speed;
                    if(mx > mwidth){
                        clearInterval(running);
                        ps.$('.draw').onmouseout();
                    }else{
                        ps.$('.draw').onmousemove({clientX:mx, clientY:my});
                    }
                }






        }



        //Ready to get started, lets go
        function startSimulation(ps){

            var c = ps.$('.draw');

            var currentSlide = 0;

            function nextInterval(ms){
                setTimeout(function(){
                    currentSlide++;

                    if(currentSlide >= slideImages.length){
                        currentSlide = 0;
                    }

                    if(ps.ptlGap <= slideImages[currentSlide].ptlGap){
                        ps.ptlGap = slideImages[currentSlide].ptlGap;
                        setTimeout(function(){
                            ps.ptlSize = slideImages[currentSlide].ptlSize;
                        }, 500);
                    }else{
                        ps.ptlSize = slideImages[currentSlide].ptlSize;
                        ps.ptlGap = slideImages[currentSlide].ptlGap;
                    }

                    ps.nextSlide();
                    runMouseThrough(slideImages[currentSlide].direction, slideImages[currentSlide].offset);

                    nextInterval(slideImages[currentSlide].slideTime);
                }, ms);
            }

            //start it out.
            runMouseThrough(slideImages[currentSlide].direction, slideImages[currentSlide].offset);
            nextInterval(slideImages[currentSlide].slideTime);

        }
    });
})(jQuery);
