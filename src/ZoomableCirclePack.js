import React, { useRef, useEffect } from "react";

// import "./App.css";
import * as d3 from "d3";
import { data } from "./data/data.js";

import { dummyPosts, dummyRelations } from "./data/postDummyData.js";

function ZoomableCirclePack() {
  const svgRef = useRef();

  const width = 700;
  const height = 700;

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
    // const root = pack(data);

    let focus = root;
    let view;

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      // .style("display", "block")
      .style("margin", "0 -14px")
      .style("cursor", "pointer")
      .on("click", (event) => zoom(event, root));

    // d3.select("svg").attr(
    //   "viewBox",
    //   `-${width / 2} -${height / 2} ${width} ${height}`
    // // );

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(root.descendants().slice(1))
      .join("circle")
      .attr("fill", (d) => (d.children ? color(d.depth) : "white"))
      // .attr("fill", (d) => d.data.color)
      .attr("pointer-events", (d) => (!d.children ? "none" : null))
      .style("display", "block")
      .on("mouseover", function () {
        d3.select(this).attr("stroke", "#000000");
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke", null);
      })
      .on(
        "click",
        (event, d) => focus !== d && (zoom(event, d), event.stopPropagation())
      )
      .on("dblclick", function () {
        window.open("https://www.google.com");
      });

    svg.style("background-color", "#A3F5CF");

    const label = svg
      .append("g")
      .attr("class", "titles")
      .style("font", "10px sans-serif")
      .style("font", "20px sans-serif")
      .style("font-weight", "bold")
      .style(
        "text-shadow",
        "0 0 2px white, 0 0 2px white, 0 0 2px white, 0 0 2px white"
      )
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
      .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
      .style("display", (d) => (d.parent === root ? "inline" : "none"))
      .text((d) => d.data.name);

    const icon = svg
      .append("g")
      .attr("class", "icons")
      .style("font", "20px sans-serif")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
      .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
      .style("display", (d) => (d.parent === root ? "inline" : "none"))
      .attr("class", "material-icons")
      .text((d) => d.data.icon);

    // zoomTo([root.x - width / 2, root.y - height / 2, root.r * 2]);
    zoomTo([root.x, root.y, root.r * 2]);

    function zoomTo(v) {
      const k = width / v[2];

      view = v;

      label.attr(
        "transform",
        (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
      );
      icon.attr(
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
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
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
      icon
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
    post.name = post.title;

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

export default ZoomableCirclePack;
