   mapboxgl.accessToken = 'pk.eyJ1IjoibWdhbGthIiwiYSI6IjNjZTdjU28ifQ.k1W5iD1MZ1p3YKBYlZO9LQ';
    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mgalka/cipf401hz0001bjm539gd664h', //stylesheet location
        center: [0, 0], // starting position
        zoom: 1, // starting zoom
        maxZoom: 4.5
    });

    map.addControl(new mapboxgl.Navigation());

    map.dragRotate.disable();

    map.touchZoomRotate.disableRotation();

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function ( /* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var WIDTH = 1200,
        HEIGHT = 700;



    // set some camera attributes
    var VIEW_ANGLE = 90,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 1000;


    // get the DOM element to attach to
    // - assume we've got jQuery to hand
    var $container = $('#container');

    // create a WebGL renderer, camera
    // and a scene
    var renderer = new THREE.WebGLRenderer();
    var camera = new THREE.Camera(VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR);




    var scene = new THREE.Scene();

    // the camera starts at 0,0,0 so pull it back
    camera.position.z = 350;

    // start the renderer - set the clear colour
    // to a full black
    //renderer.setClearColor(new THREE.Color(0, 1));
    renderer.setSize(WIDTH, HEIGHT);

    // attach the render-supplied DOM element
    $container.append(renderer.domElement);

    function toScreenPosition(obj, camera) {
        var vector = new THREE.Vector3();

        var widthHalf = 0.5 * width;
        var heightHalf = 0.5 * height;

        obj.updateMatrixWorld();
        vector.setFromMatrixPosition(obj.matrixWorld);
        vector.project(camera);

        vector.x = (vector.x * widthHalf) + widthHalf;
        vector.y = -(vector.y * heightHalf) + heightHalf;

        return {
            x: vector.x,
            y: vector.y
        };

    };

    var cnttotal = 0;

    var selected = "0";

    var addoffset = "0"

    var ddd;

    var clicked = "0";

    var clickedcbsa = 0;

    var tempflows;

    var maxage = 500;

    newzpos = 1;

    for (var j = 0; j < cntarr.length; j++) {

        cnttotal = cnttotal + cntarr[j];
    }



    // create the particle variables
    var particleCount = cnttotal,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
            //color: 0xFFDD00,
            size: 3,
            map: THREE.ImageUtils.loadTexture(
                "./img/yellowball.png"
            ),
            blending: THREE.AdditiveBlending,
            transparent: true
        });

    // now create the individual particles

    var startarr = [
        [104, 170],
        [-104, -170],
        [-104, -170],
        [-104, -170]
    ];
    var endarr = [
        [10, 10],
        [120, 80],
        [130, 190],
        [130, 190]
    ];

    var speedarr = [
        [1, 0],
        [1.9, 0],
        [0, 4],
        [0, 4]
    ];


    //var svgcontainer = map.getCanvasContainer();

    //var svg = d3.select(svgcontainer).append("svg").attr("height",HEIGHT).attr("width",WIDTH); //.style("pointer-events","none");

    var svg = d3.select("svg").attr("height", HEIGHT).attr("width", WIDTH).style("pointer-events", "none");
    var g = svg.append("g");

    /*
    var projectiona = d3.geo.albersUsa()
        .scale(1500)
        .translate([WIDTH * 0.5, HEIGHT * 0.5]);
    */

    var projectiona = d3.geo.miller()
        .scale(180)
        .translate([WIDTH / 2, HEIGHT / 2])
        .precision(.1);

    /*
    var projectionp = d3.geo.albersUsa()
        .scale(1500)
        .translate([WIDTH * 0.5 - WIDTH/2, HEIGHT * 0.5 - HEIGHT/2]);

    */
    var projectionp = d3.geo.miller()
        .scale(180)
        .translate([0, 0])
        .precision(.1);


    var projectionr = d3.geo.mercator()
        .scale(163)
        .translate([0, 0])
        .precision(.1);



    startarrq = xstartarr.map(projectiona);

    var startarrp = xstartarr.map(projectionp);

    var startarr = xstartarr.map(projectionp);

    var endarr = xendarr.map(projectionp);

    //project pts
    for (var l = 0; l < xstartarr.length; l++) {

        var temppt = map.project(new mapboxgl.LngLat(xstartarr[l][0], xstartarr[l][1]));
        var temppt2 = map.project(new mapboxgl.LngLat(xendarr[l][0], xendarr[l][1]));


        startarr[l][0] = temppt.x - WIDTH / 2;
        startarr[l][1] = temppt.y - HEIGHT / 2;

        endarr[l][0] = temppt2.x - WIDTH / 2;
        endarr[l][1] = temppt2.y - HEIGHT / 2;

    }

    var startarr = xstartarr.map(projectionr);

    var arrycalc = negy(startarr, endarr, xspeedarr);



    startarr = arrycalc[0];
    endarr = arrycalc[1];
    speedarr = arrycalc[2];


    var mnum = startarr.length;



    var path = d3.geo.path()
        .projection(projectiona);

    var pointpath = d3.geo.path()
        .projection(projectiona)
        .pointRadius(function (d) {
            return Math.max(Math.min(Math.sqrt(d.properties.abs) / 90, 36), 3) * Math.sqrt(newzpos);
        });

    var xtrans = 0;
    var ytrans = 0;


    var transformb = d3.geo.transform({
        point: projectPoint
    });

    var testarr = [
        [104, 40],
        [-104, 30],
        [-104, -10],
        [-104, 24]
    ];




    var pathpt = d3.geo.path().projection(d3.geo.transform({
            point: projectPoint
        }))
        .pointRadius(function (d) {
            return Math.max(Math.min(Math.sqrt(d.properties.abs) / 5, 36), 3) * Math.sqrt(newzpos);
        });

    function projectPoint(lon, lat) {
        var point = map.project(new mapboxgl.LngLat(lon, lat));
        this.stream.point(point.x, point.y);
    }




    var citylabel;

    var cities;

    d3.json("./data/worldmigration.json", function (error, world) {
        d3.json("./data/countryflows4.json", function (error, countryflows) {

            cbsa = topojson.feature(countryflows, countryflows.objects.countryflows4).features;


            cities = g.selectAll("pathcbsa")
                .data(cbsa).enter()
                .append("path")
                .attr("class", "feature")
                .style("pointer-events", "all")
                .style("cursor", "pointer")
                .style("fill", function (d) {
                    if (d.properties.net < 0) {
                        return "rgba(180,20,20,1)";
                    }
                    return "rgba(20,20,180,1)";
                })
                .attr("d", pathpt)
                .style("opacity", 0.9) //function (d) {
                //          return ((Math.min(d.properties.abs,1000) / 1000)*0.6 + 0.3);
                //      })
                .style("stroke-width", 0.5)
                .style("stroke", "rgb(240,240,240)")
                .on("click", function (d) {
                    click(d);
                })
                .on("mouseover", function (d) {
                    showPopover.call(this, d);
                })
                .on("mouseout", function (d) {
                    removePopovers(d);
                });


            citylabel = g.append("text").text("").attr("x", 20).attr("y", 20).style("fill",
                    "rgb(220,220,220)").attr("text-anchor", "middle").style("pointer-events", "none")
                .style("opacity", 0).style("font-size", "14pt");


            function updatecities() {


                var zoomchg = (map.getZoom() - 1) * 10;
                newzpos = Math.pow(1.0717735, zoomchg);

                if (selected == "0") {
                    cities
                        .attr("d", function (d) {
                            pathpt.pointRadius(Math.max(Math.min(Math.sqrt(d.properties.abs) / 5,
                                36), 2) * Math.sqrt(newzpos));
                            return pathpt(d);
                        });

                } else {
                    click(ddd, 1);
                }




                particleSystem.materials[0].size = 3 / Math.sqrt(newzpos);

                var centerchg = [
                    [map.getCenter().lng, map.getCenter().lat]
                ].map(projectionr);

                camera.position.z = 350 / newzpos;

                ytrans = centerchg[0][1];
                xtrans = -centerchg[0][0];
                addoffset = "-1";



            }



            map.on("click", mouseout);

            map.on("viewreset", updatecities);

            map.on("movestart", function () {
                svg.classed("hidden", true);
                removePopovers();
                d3.select("#container").classed("hidden", true);
            });
            map.on("rotate", function () {
                svg.classed("hidden", true);
                d3.select("#container").classed("hidden", true);
            });
            map.on("moveend", function () {
                updatecities();
                svg.classed("hidden", false);
                d3.select("#container").classed("hidden", false);
            })


        });
    });






    var particlearr = [
        [543, 555, 4.58, -2.6, 25],
        [1001, 295, -3.88, 2.51, 25],
        [1001, 295, -4.41, 2.4, 38]
    ];

    for (var p = 0; p < startarr.length; p++) {

        for (var q = 0; q < cntarr[p]; q++) {

            var startpoint = [startarr[p % mnum][0] + Math.random() * 1 - 0.5, startarr[p % mnum][1] + Math.random() *
                1 - 0.5
            ];


            var pX = startpoint[0] + (maxage * q / cntarr[p]) * speedarr[p][0],
                pY = startpoint[1] + (maxage * q / cntarr[p]) * speedarr[p][1],
                pZ = 0, //Math.random() * 500 - 250,
                particle = new THREE.Vertex(
                    new THREE.Vector3(pX, pY, pZ)
                );


            particle.velocity = new THREE.Vector3(
                speedarr[p % mnum][0],
                speedarr[p % mnum][1],
                0);

            particle.startpt = [startpoint[0], startpoint[1]];
            particle.age = Math.round(maxage * q / cntarr[p]);

            particle.from = xtofromarr[p][0];
            particle.to = xtofromarr[p][1];

            particle.ystart = pY;
            particle.xstart = pX;
            particle.agestart = particle.age;

            particles.vertices.push(particle);
        }
    }


    var particleSystem = new THREE.ParticleSystem(
        particles,
        pMaterial);



    particleSystem.sortParticles = true;

    scene.addChild(particleSystem);

    // animation loop
    function update() {

        // add some rotation to the system
        particleSystem.rotation.y += 0; //+= 0.01;

        var pCount = particleCount;

        if (selected == "-1") {
            selected = "-2";
        }

        if (addoffset == "-1") {
            addoffset = "-2";
        }

        var k = 0;
        while (pCount--) {

            var particle = particles.vertices[pCount];


            if (particle.age >= maxage) {
                particle.age = 0;

                particle.position.x = particle.startpt[0] + xtrans;
                particle.position.y = particle.startpt[1] + ytrans;




            }



            if (selected == "0") {


                // and the position
                particle.position.addSelf(
                    particle.velocity);


                if (particle.position.x > 600) {
                    particle.position.x = particle.xstart + xtrans;
                    particle.position.y = particle.ystart + ytrans;
                    particle.age = particle.agestart;
                }

                particle.age++;
            } else if (particle.from == selected || particle.to == selected) {

                if (particle.position.x > 600) {
                    particle.position.x = particle.xstart + xtrans;
                    particle.position.y = particle.ystart + ytrans;
                    particle.age = particle.agestart;
                }

                particle.position.addSelf(
                    particle.velocity);


                particle.age++;

            } else if (selected == "-2") {
                particle.position.x = particle.xstart + xtrans;
                particle.position.y = particle.ystart + ytrans;
                particle.age = particle.agestart;

            } else if (particle.from !== selected && particle.to !== selected) {
                particle.position.x = 700;
                particle.position.y = 380;

            }

            if (addoffset == "-2") {
                if (particle.position.x <= 600) {
                    particle.position.x = particle.xstart + xtrans;
                    particle.position.y = particle.ystart + ytrans;
                    particle.age = particle.agestart;
                }
            }


        }

        if (selected == "-2") {
            selected = "0";
        }

        if (addoffset == "-2") {
            addoffset = "0";
        }

        // flag to the particle system that we've
        // changed its vertices. This is the
        // dirty little secret.
        particleSystem.geometry.__dirtyVertices = true;

        renderer.render(scene, camera);

        // set up the next call
        requestAnimFrame(update);
    }
    requestAnimFrame(update);


    function negy(coorarry, endarray, diffarry) {


        for (var i = 0; i < coorarry.length; i++) {

            coorarry[i][1] = coorarry[i][1] * -1;
            endarray[i][1] = endarray[i][1] * -1;

            diffarry[i][0] = (endarray[i][0] - coorarry[i][0]) / maxage;
            diffarry[i][1] = (endarray[i][1] - coorarry[i][1]) / maxage;

        }



        return [coorarry, endarray, diffarry];

    }




    function click(dd, notransition) {
        ddd = dd;
        clicked = dd.properties.country;
        clickedcbsa = dd.properties.code2;

        selected = dd.properties.code2;

        var temppos = map.project(new mapboxgl.LngLat(dd.properties.x, dd.properties.y));

        citylabel.attr("x", temppos.x).attr("y", temppos.y + 50).text(dd.properties.country).style("opacity", 0.8);

        tempflows = xflows[dd.properties.code2];

        var dur = 500;
        if (notransition == 1) {
            dur = 0;
        }

        cities
            .filter(function (d) {

                return tempflows[d.properties.code2];
            })
            .transition().duration(dur)
            .style("opacity", function (d) {
                if (d.properties.code2 == dd.properties.code2) {
                    return 1;
                }
                return 0.9;
            })
            .style("stroke-width", function (d) {
                if (d.properties.code2 == dd.properties.code2) {
                    return 2;
                }
                return 0.5;
            })
            .style("fill", function (d) {
                if (d.properties.code2 !== dd.properties.code2) {
                    if (tempflows[d.properties.code2] > 0) {
                        return "rgb(220,20,20)";
                    }
                    return "rgb(20,20,220)";
                } else {
                    if (tempflows[d.properties.code2] < 0) {
                        return "rgb(240,0,0)";
                    }
                    return "rgb(0,0,240)";
                }
            })
            .attr("d", function (d) {
                if (d.properties.code2 !== dd.properties.code2) {
                    pathpt.pointRadius(Math.max(Math.min(Math.sqrt(Math.abs(tempflows[d.properties.code2])) / 3,
                        36), 2) * Math.sqrt(newzpos));
                } else {
                    pathpt.pointRadius(Math.max(Math.min(Math.sqrt(Math.abs(tempflows[d.properties.code2])) / 5,
                        36), 2) * Math.sqrt(newzpos));
                }
                return pathpt(d);
            });




        cities
            .filter(function (d) {

                if (tempflows[d.properties.code2]) {
                    return false;
                }
                return true;
            })
            .transition()
            .style("opacity", 0);


        removePopovers();
    }



    function removePopovers() {

        $('.popover').each(function () {
            $(this).remove();
        });

    }


    function showPopover(d) {

        if (clicked == "0" || d.properties.code2 == clickedcbsa) {
            $(this).popover({
                title: "<strong>" + d.properties.country + "</strong>",
                placement: 'auto top',
                container: 'body',
                trigger: 'manual',
                html: true,
                content: function () {



                    return "Net Migration: " + d3.format("n")(d.properties.net);
                }
            });

            $(this).popover('show');
            $(".popover-title").html("<strong>" + d.properties.country + "</strong>");
            $(".popover-content").html("Net Migration: " + d3.format("n")(d.properties.net));

        } else if (tempflows[d.properties.code2]) {

            $(this).popover({
                title: "<strong>" + d.properties.country + " --> " + clicked + "</strong>",
                placement: 'auto top',
                container: 'body',
                trigger: 'manual',
                html: true,
                content: function () {


                    return "Net Migration: " + d3.format("n")(tempflows[d.properties.code2]);
                }
            });
            $(this).popover('show');
            $(".popover-title").html("<strong>" + d.properties.country + " --> " + clicked + "</strong>");
            $(".popover-content").html("Net Migration: " + d3.format("n")(tempflows[d.properties.code2]));
        }


    }




    function mouseout() {
        clicked = "0";
        clickedcbsa = 0;

        selected = "-1";



        citylabel.style("opacity", 0);

        cities.transition()
            .attr("d", function (d) {

                pathpt.pointRadius(Math.max(Math.min(Math.sqrt(d.properties.abs) / 5, 36), 2) * Math.sqrt(newzpos));
                return pathpt(d);
            })
            .style("fill", function (d) {
                if (d.properties.net < 0) {
                    return "rgb(180,20,20)";
                }
                return "rgb(20,20,180)";
            })
            .style("opacity", function (d) {
                return ((Math.min(d.properties.abs, 1000) / 1000) * 0.6 + 0.3);
            })
            .style("stroke-width", 0.5);

    }

    function addoffset() {
        var pCount = particleCount;
        while (pCount--) {
            var particle = particles.vertices[pCount];
            particle.position.x = particle.position.x + xtrans;
            particle.position.y = particle.position.y + ytrans;
        }
    }