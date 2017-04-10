/*
 * @Author: Ruth
 * @Date:   2017-02-21 16:35:00
 * @Last Modified by:   Ruth
 * @Last Modified time: 2017-04-01 11:18:48
 */

'use strict';

define(function(require, exports, module) {

    var d3 = require('../lib/d3');
    var d3_hexbin = require('../lib/d3-hexbin');
    var data = require('./data.js');

    var Event = require('../common/listener');

    var me = this;

    // Do the stuff -- to be called after D3.js has loaded
    //function D3ok() {

    // Some constants
    var WIDTH = 800,
        HEIGHT = 800,
        SHOW_THRESHOLD = 6,
        oriCircleSize = 5;

    var currCircleSize = oriCircleSize;

    // Variables keeping graph state
    var activeNode = undefined;
    var currentOffset = {
        x: 0,
        y: 0
    };
    var currentZoom = 1;

    var showNodes = undefined;

    // The D3.js scales
    var xScale = d3.scale.linear()
        .domain([0, WIDTH])
        .range([0, WIDTH]);
    var yScale = d3.scale.linear()
        .domain([0, HEIGHT])
        .range([0, HEIGHT]);
    var zoomScale = d3.scale.linear()
        .domain([1, 10])
        .range([1, 10])
        .clamp(true);

    // Add to the page the SVG element that will contain the movie network
    var svg = d3.select("#sketch-view-map").append("svg:svg")
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr("width", WIDTH)
        .attr("height", HEIGHT)
        .attr("id", "graph")
        .attr("viewBox", "0 0 " + WIDTH + " " + HEIGHT)
        .attr("preserveAspectRatio", "xMidYMid meet");

    var retrResultDiv = d3.select("#retr-result");


    // Get the current size & offset of the browser's viewport window
    function getViewportSize(w) {
        var w = w || window;
        if (w.innerWidth != null)
            return {
                w: w.innerWidth,
                h: w.innerHeight,
                x: w.pageXOffset,
                y: w.pageYOffset
            };
        var d = w.document;
        if (document.compatMode == "CSS1Compat")
            return {
                w: d.documentElement.clientWidth,
                h: d.documentElement.clientHeight,
                x: d.documentElement.scrollLeft,
                y: d.documentElement.scrollTop
            };
        else
            return {
                w: d.body.clientWidth,
                h: d.body.clientHeight,
                x: d.body.scrollLeft,
                y: d.body.scrollTop
            };
    }

    function getQStringParameterByName(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }


    function getRetrResult(n, nodeArray) {

    }


    // *************************************************************************

    //  d3.json( data, 
    //    'pca-mapped-locs.json',
    //    function(data) {

    // Declare the variables pointing to the node & link arrays
    var nodeArray = data.nodes;
    var linkArray = data.links;

    var minLinkWeight =
        Math.min.apply(null, linkArray.map(function(n) {
            return n.weight;
        }));
    var maxLinkWeight =
        Math.max.apply(null, linkArray.map(function(n) {
            return n.weight;
        }));

    // A couple of scales for node radius & edge width
    var node_size = d3.scale.linear()
        .domain([5, 10]) // we know score is in this domain
        .range([1, 16])
        .clamp(true);
    var edge_width = d3.scale.pow().exponent(8)
        .domain([minLinkWeight, maxLinkWeight])
        .range([1, 3])
        .clamp(true);

    /* Add drag & zoom behaviours */
    svg.call(d3.behavior.drag()
        .on("drag", dragmove));
    svg.call(d3.behavior.zoom()
        .x(xScale)
        .y(yScale)
        .scaleExtent([1, 10])
        .on("zoom", doZoom));


    // ------- Hexbin Map ------

    var networkGraph = svg.append('svg:g').attr('class', 'grpParent');

    var color = d3.scale.linear()
        .domain([0, 10])
        .range(["white", "steelblue"])
        .interpolate(d3.interpolateLab);

    var initRadius = 25;
    var hexbin = d3_hexbin.hexbin()
        // .size([WIDTH * 2, HEIGHT * 2])
        .radius(initRadius);

    var points_ori = d3.range(nodeArray.length).map(function(d) {
        return [nodeArray[d].x + WIDTH / 2, nodeArray[d].y + HEIGHT / 2, nodeArray[d].index, nodeArray[d].id];
    })
    var points = d3.range(nodeArray.length).map(function(d) {
        return [nodeArray[d].x + WIDTH / 2, nodeArray[d].y + HEIGHT / 2, nodeArray[d].index, nodeArray[d].id];
    })
    var unit = 1.0,
        iconSize = 30;

    var hexbins = hexbin(points);

    networkGraph.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("class", "mesh")
        .attr("width", WIDTH * 10)
        .attr("height", HEIGHT * 10);


    var graphHexbins = networkGraph.append("svg:g")
        .attr("class", "grp gHex")
        .attr("clip-path", "url(#clip)")
        .selectAll(".hexagon")
        .data(hexbins)
        .enter().append("path")
        .attr("id", function(d) {
            return "hexagon" + d[0][3];
        })
        .attr("class", "hexagon")
        .attr("d", hexbin.hexagon())
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
        .style("fill", function(d) {
            return color(Math.sqrt(d.length));
        })
        //.style("fill", function(d) {
        //    cnode_id = d[0][2];
        //            c = colormap.colormap[nodeArray[cnode_id].labely-1].rgb;
        //            return "rgb("+c[0]+","+c[1]+","+c[2]+")";
        // //           return color(90-nodeArray[cnode_id].labely);
        //     })
        .attr('pointer-events', 'all')
        .on("touchend", function(d) {
            /*cnode_id = d[0][2];
            showRetrResults(nodeArray[cnode_id]);*/
            if (me.timer) {
                clearTimeout(me.timer);
            }
            cnode_id = d[0][2];

            var image = new Image();
            image.src = 'img/traindata-small/' + cnode_id + '.png';

            // 触发查询事件
            Event.emit('setCva', image);
            console.log('触发查询');

            showRetrResults(nodeArray[cnode_id]);
            // $('.gallery').hide();

        })
        .on("mouseover", function(d) {
            highlightHexbin(d, true, this);
        })
        //.on("mouseout",  function(d) { highlightHexbin(d,false,this);  } );

    var node = d3.select(".hexagon")[0][0].__data__
    highlightHexbin(node, true)
    var cnode_id = node[0][2];
    showRetrResults(nodeArray[cnode_id]);

    var graphIcons = networkGraph.append('svg:g').attr('class', 'grp gIcon');

    for (var i = 0; i < hexbins.length; ++i) {
        var head = hexbins[i][0];
        var cnode_index = head[2];
        var cnode_id = head[3];

        var icon = graphIcons.append("svg:g")
            .attr("id", 'icon' + cnode_id)
            .attr("class", "icon")
            .attr('pointer-events', 'none')
            .append("image")
            .attr("class", "iconon")
            .attr("xlink:href", "img/traindata-nobg-small/" + cnode_id + ".png")
            .attr('pointer-events', 'none')
            .attr("x", hexbins[i].x - iconSize / 2)
            .attr("y", hexbins[i].y - iconSize / 2)
            .attr("width", iconSize)
            .attr("height", iconSize);

    }


    function highlightHexbin(node, on) {
        // If we are to activate a node, and there's already one active,
        // first switch that one off
        if (on && activeNode !== undefined) {
            highlightHexbin(activeNode, false);
        }


        iconSize = currentZoom * 30 / unit;

        var head = node[0];
        var cnode_index = head[2];
        var cnode_id = head[3];
        var icon = d3.select('#icon' + cnode_id);
        icon.select("image").classed("main", on);

        var hex = d3.select("#hexagon" + cnode_id);

        //        if (on) {
        //            hex.attr("d", hexbin.hexagon( (z/unit) * initRadius * 1.5 ));
        //        } else {
        //            hex.attr("d", hexbin.hexagon( (z/unit) * initRadius ));
        //        }

        hex.classed('main', on);


        // set the value for the current active node
        activeNode = on ? node : undefined;

        d3.select('#debug').text("(" + currentOffset.x + "," + currentOffset.y + ")" + currentZoom + "active node:" + activeNode)

    }


    function highlightGraphNode(node, on) {
        // If we are to activate a node, and there's already one active,
        // first switch that one off
        if (on && activeNode !== undefined) {
            highlightGraphNode(hexgin[activeNode], false);
        }

        // locate the SVG nodes: circle & label group
        circle = d3.select('#c' + node.id);
        if (on && circle.style("visibility") !== "visible") {
            return;
        }

        label = d3.select('#l' + node.id);
        icon = d3.select('#icon' + node.id);

        if (!on) {
            circle.classed('main', on);
            circle.attr("r", (on ? currCircleSize * 1.6 : currCircleSize));

            icon.select('image').classed('main', on);
            icon.selectAll('rect').classed('main', on);
            label.classed('on', on);
            label.selectAll('text').classed('main', on);

            return;
        }


        // activate/deactivate the node itself
        circle.classed('main', on);
        circle.attr("r", (on ? currCircleSize * 1.6 : currCircleSize));
        icon.classed('iconon', on);
        icon.select('image').classed('iconon', on).classed('main', on);
        icon.selectAll('rect').classed('main', on);
        label.classed('on', on);
        label.selectAll('text').classed('main', on);


        // set the value for the current active node
        activeNode = on ? node.index : undefined;

        d3.select('#debug').text("(" + currentOffset.x + "," + currentOffset.y + ")" + currentZoom + "active node:" + activeNode)

    }


    var selectNode = function(new_idx, doMoveTo) {

        // do we want to center the graph on the node?
        doMoveTo = doMoveTo || false;
        if (doMoveTo) {
            s = getViewportSize();
            width = s.w < WIDTH ? s.w : WIDTH;
            height = s.h < HEIGHT ? s.h : HEIGHT;
            offset = {
                x: s.x + width / 2 - nodeArray[new_idx].x * currentZoom,
                y: s.y + height / 2 - nodeArray[new_idx].y * currentZoom
            };
            repositionGraph(offset, undefined, 'move');
        }
        // Now highlight the graph node and show its node panel
        highlightGraphNode(nodeArray[new_idx], true);
        showRetrResults(nodeArray[new_idx]);
    }


    function showRetrResults(node) {
        // Fill it and display the panel
        retrResultDiv
            .html(getRetrResult(node, nodeArray))
            .attr("class", "panel_on");
    }


    function repositionGraph(off, z, mode) {

        // do we want to do a transition?
        var doTr = (mode == 'move');

        // drag: translate to new offset
        if (off !== undefined &&
            (off.x != currentOffset.x || off.y != currentOffset.y)) {
            var g = d3.select('g.grpParent')

            g.attr("transform", function(d) {
                return "translate(" +
                    off.x + "," + off.y + ")"
            });
            currentOffset.x = off.x;
            currentOffset.y = off.y;
            d3.select('#debug').text("(" + currentOffset.x + "," + currentOffset.y + ")" + currentZoom + "active node:" + activeNode)
        }


        // zoom: get new value of zoom
        if (z === undefined) {
            if (mode != 'tick')
                return; // no zoom, no tick, we don't need to go further
            z = currentZoom;
        } else


        // redraw hexgons when size large enough
            var redraw = (Math.floor(currentZoom) != Math.floor(z));
        unit = Math.max(1, Math.floor(z));

        currentZoom = z;
        d3.select('#debug').text("(" + currentOffset.x + "," + currentOffset.y + ")" + currentZoom + "active node:" + activeNode)

        if (!redraw) {

            var h = doTr ? graphHexbins.transition().duration(500) : graphHexbins;
            h.attr("d", function(d) {
                    return hexbin.hexagon((z / unit) * initRadius);
                })
                .attr("transform", function(d) {
                    return "translate(" + z * d.x / unit + "," + z * d.y / unit + ")"
                });


        } else {


            for (var i = 0; i < points_ori.length; i++) {
                points[i][0] = points_ori[i][0] * unit;
                points[i][1] = points_ori[i][1] * unit;
            }
            hexbins = hexbin(points);

            networkGraph.selectAll(".hexagon").remove();
            graphHexbins = networkGraph.select("g.gHex")
                .selectAll(".hexagon")
                .data(hexbins)
                .enter().append("path")
                .attr("id", function(d) {
                    return "hexagon" + d[0][3];
                })
                .attr("class", "hexagon")
                .attr("d", hexbin.hexagon((z / unit) * initRadius))
                .attr("transform", function(d) {
                    return "translate(" + z * d.x / unit + "," + z * d.y / unit + ")";
                })
                .style("fill", function(d) {
                    return color(Math.sqrt(d.length));
                })
                //                .style("fill", function(d) {
                //                    cnode_id = d[0][2];
                //                    c = colormap.colormap[nodeArray[cnode_id].labely-1].rgb;
                //                    return "rgb("+c[0]+","+c[1]+","+c[2]+")";
                //                    return color(90-nodeArray[cnode_id].labely);
                //                })
                .attr('pointer-events', 'all')
                .on('touchstart', function(d) {
                    /*cnode_id = d[0][2];
                    me.timer = setTimeout(function() {
                        var image = new Image();
                        image.src = 'supply/102_shrec2012png/D00141view/12.png';
                        // image.src = 'img/traindata-nobg-small/' + cnode_id + '.png';

                        // 触发查询事件
                        Event.emit('setCva', image);
                        alert('触发查询事件');
                    }, 1000);*/
                })
                .on('touchmove', function(d) {
                    if (me.timer) {
                        clearTimeout(me.timer);
                    }
                })
                .on("touchend", function(d) {
                    if (me.timer) {
                        clearTimeout(me.timer);
                    }
                    cnode_id = d[0][2];

                    var image = new Image();
                    image.src = 'img/traindata-small/' + cnode_id + '.png';

                    // 触发查询事件
                    Event.emit('setCva', image);
                    console.log('触发查询');

                    showRetrResults(nodeArray[cnode_id]);
                    // $('.gallery').hide();
                })
                .on("mouseover", function(d) {
                    highlightHexbin(d, true, this);
                })

            activeNode = undefined;

        }


        networkGraph.selectAll(".icon").remove();
        graphIcons = networkGraph.select("g.gIcon");
        d3.selectAll("image").classed("iconon", false);

        iconSize = currentZoom * 30 / unit;

        var s = getViewportSize();
        var width = s.w < WIDTH ? s.w : WIDTH;
        var height = s.h < HEIGHT ? s.h : HEIGHT;


        for (i = 0; i < hexbins.length; ++i) {
            var head = hexbins[i][0];
            var cnode_index = head[2];
            var cnode_id = head[3];

            var ox = hexbins[i].x / unit - currentOffset.x / z;
            var oy = hexbins[i].y / unit - currentOffset.y / z;

            if (ox < -20 || ox > width * 2 + 20 || oy < -20 || oy > height * 2 + 20)
                continue;

            icon = graphIcons.append("svg:g")
                .attr("id", 'icon' + cnode_id)
                .attr("class", "icon")
                .attr('pointer-events', 'none')
                .append("image")
                .attr("class", "iconon")
                .attr("xlink:href", "img/traindata-nobg-small/" + cnode_id + ".png")
                .attr('pointer-events', 'none')
                .attr("x", -iconSize / 2)
                .attr("y", -iconSize / 2)
                .attr("width", iconSize)
                .attr("height", iconSize)
                .attr("transform", function(d) {
                    return "translate(" + z * hexbins[i].x / unit + "," + z * hexbins[i].y / unit + ")"
                });

        }

        d3.select('#debug').text("(" + currentOffset.x + "," + currentOffset.y + ")" + currentZoom + "active node:" + activeNode + "unit:" + unit + "anchor:(" + d3.event.x + "," + d3.event.y + ")")

    }


    /* --------------------------------------------------------------------- */
    /* Perform drag
     */
    function dragmove(d) {
        var offset = {
            x: currentOffset.x + d3.event.dx,
            y: currentOffset.y + d3.event.dy
        };
        repositionGraph(offset, currentZoom, 'drag');
    }


    /* --------------------------------------------------------------------- */
    /* Perform zoom. We do "semantic zoom", not geometric zoom
     * (i.e. nodes do not change size, but get spread out or stretched
     * together as zoom changes)
     */
    function doZoom(increment) {
        var newZoom = increment === undefined ? d3.event.scale : zoomScale(currentZoom + increment);
        if (currentZoom == newZoom)
            return; // no zoom change

        // See what is the current graph window size
        var s = getViewportSize();
        var width = s.w < WIDTH ? s.w : WIDTH;
        var height = s.h < HEIGHT ? s.h : HEIGHT;

        // Compute the new offset, so that the graph center does not move
        var zoomRatio = newZoom / currentZoom;

        var anchorx = width / 2,
            anchory = height / 2;

        var rawx = (anchorx - currentOffset.x) / currentZoom,
            rawy = (anchory - currentOffset.y) / currentZoom,

            newOffset = {
                x: currentOffset.x + rawx * (currentZoom - newZoom),
                y: currentOffset.y + rawy * (currentZoom - newZoom)
            };

        // Reposition the graph
        repositionGraph(newOffset, newZoom, "zoom");
    }

    var zoomCall = doZoom; // unused, so far

    // });

    //} // end of D3ok()

});