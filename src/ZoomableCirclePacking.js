import React, { useRef, useEffect } from "react";

// import "./App.css";
import * as d3 from "d3";
import { data } from "./data/data.js";

import { dummyPosts, dummyRelations } from "./data/postDummyData.js";

function ZoomableCirclePacking() {
  const svgRef = useRef();

  const width = 400;
  const height = 400;

  // will be called initially and on every data change
  useEffect(() => {
    let color = d3
      .scaleLinear()
      .domain([0, 5])
      .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl);

    let pack = (data) =>
      d3.pack().size([width, height]).padding(3)(
        d3
          .hierarchy(data)
          .sum((d) => d.value)
          .sort((a, b) => b.value - a.value)
      );

    const root = pack(formatData(dummyPosts, dummyRelations));
    let focus = root;
    let view;

    const svg = d3.select(svgRef.current);
    d3.create("svg")
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .style("display", "block")
      .style("margin", "0 -14px")
      .style("background", color(0))
      .style("cursor", "pointer")
      .on("click", (event) => zoom(event, root));

    const node = svg
      .append("g")
      .attr("stroke", "black")
      .attr("stroke-width", "2")
      .selectAll("circle")
      .data(root.descendants().slice(1))
      .join("circle")
      // .attr("fill", (d) => (d.children ? color(d.depth) : "white"))
      .attr("fill", (d) => d.data.color)
      .attr("pointer-events", (d) => (!d.children ? "none" : null))
      .style("display", "block")

      .on("mouseover", function () {
        d3.select(this).attr("stroke", "#f54260");
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke", null);
      })
      .on(
        "click",
        (event, d) => focus !== d && (zoom(event, d), event.stopPropagation())
      );

    const label = svg
      .append("g")

      .style("font", "10px sans-serif")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
      .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
      .style("display", (d) => (d.parent === root ? "inline" : "none"))
      .text((d) => d.data.title);

    zoomTo([root.x - width / 2, root.y - height / 2, root.r * 2]);

    function zoomTo(v) {
      const k = width / v[2];

      view = v;

      label.attr(
        "transform",
        (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
      );
      node.attr(
        "transform",
        (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
      );
      node.attr("r", (d) => d.r * k);
    }

    function zoom(event, d) {
      const focus0 = focus;

      focus = d;

      const transition = svg
        .transition()
        .duration(event.altKey ? 7500 : 750)
        .tween("zoom", (d) => {
          const i = d3.interpolateZoom(view, [
            focus.x - focus.r,
            focus.y - focus.r,
            focus.r * 2,
          ]);
          return (t) => zoomTo(i(t));
        });

      label
        .filter(function (d) {
          return d.parent === focus || this.style.display === "inline";
        })
        .transition(transition)
        .style("fill-opacity", (d) => (d.parent === focus ? 1 : 0))
        .on("start", function (d) {
          if (d.parent === focus) this.style.display = "inline";
        })
        .on("end", function (d) {
          if (d.parent !== focus) this.style.display = "none";
        });
    }
  }, []);

  return (
    <React.Fragment>
      <svg ref={svgRef} width={width} height={height}></svg>
    </React.Fragment>
  );
}

function formatData(posts, relations) {
  //Array containing the root objects (the parents)
  let roots = [];

  //map to get posts by id {postID, postObject}
  let postsMap = new Map();

  let colorMap = new Map();
  colorMap.set("Idea", "rgb(51,102,255)");
  colorMap.set("Topic", "rgb(255,204,102)");
  colorMap.set("Concern", "rgb(255,0,0)");
  colorMap.set("Information", "rgb(224,224,209)");
  colorMap.set("Action Item", "");
  colorMap.set("Event", "");
  colorMap.set("Question", "");

  let iconMap = new Map();
  iconMap.set("Idea", "emoji_objects");
  iconMap.set("Topic", "device_hub");
  iconMap.set("Concern", "error");
  iconMap.set("Information", "info");
  iconMap.set("Action Item", "check_circle");
  iconMap.set("Event", "event");
  iconMap.set("Question", "help");

  //map each post by ID
  posts.forEach((post) => {
    //give each post object a children array
    post.children = [];
    post.value = Math.floor(Math.random() * 100 + 50);
    post.color = colorMap.get(post.type);
    post.icon = iconMap.get(post.type);

    //map each post by its ID
    postsMap.set(post._id, post);

    //fill the roots array with all posts
    roots.push(post);
  });

  for (let i = 0; i < relations.length; i++) {
    let parent = postsMap.get(relations[i].post1);
    let child = postsMap.get(relations[i].post2);

    parent.children.push(child);
    if (roots.includes(child)) roots.splice(roots.indexOf(child), 1);
  }

  return roots.length === 1
    ? roots[0]
    : {
        value: 1,
        children: roots,
        color: colorMap.get("Idea"),
      };
}

export default ZoomableCirclePacking;
