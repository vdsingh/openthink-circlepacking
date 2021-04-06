import React, { useRef, useEffect } from "react";

// import "./App.css";
import * as d3 from "d3";
// import { data } from "./data/data.js";

import { dummyPosts, dummyRelations } from "../data/postDummyData.js";

function CirclePack() {
  const svgRef = useRef();

  const width = 400;
  const height = 400;

  // will be called initially and on every data change
  useEffect(() => {
    const color = d3.scaleSequential([8, 0], d3.interpolateMagma);
    const format = d3.format(",d");

    let pack = (data) =>
      d3
        .pack()
        .size([width - 2, height - 2])
        .padding(3)(
        d3
          .hierarchy(data)
          .sum((d) => d.value)
          .sort((a, b) => b.value - a.value)
      );

    const svg = d3.select(svgRef.current);
    const root = pack(formatData(dummyPosts, dummyRelations));

    svg
      .attr("viewBox", [0, 0, width, height])
      .style("font", "10px sans-serif")
      .attr("text-anchor", "middle");

    const node = svg
      .selectAll("g")
      .data(d3.group(root.descendants(), (d) => d.height))
      .join("g")
      .selectAll("g")
      .data((d) => d[1])
      .join("g")
      .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`);

    node
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "black")
      .attr("stroke-width", "2");

    const leaf = node.filter((d) => !d.children);

    leaf
      .append("text")
      .append("tspan")
      .attr("x", -25)
      .attr("y", 10)
      .attr("class", "material-icons")
      .text((d) => d.data.icon);

    leaf
      .append("text")
      .attr("clip-path", (d) => d.clipUid)
      .selectAll("tspan")
      .data((d) => d.data.title.split(/(?=[A-Z][a-z])|\s+/g))
      .join("tspan")
      .attr("x", 0)
      .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
      .text((d) => d);

    leaf.select("text");

    node.append("title").text(
      (d) =>
        `${d
          .ancestors()
          .map((d) => d.data.title)
          .reverse()
          .join("/")}\n${format(d.value)}`
    );
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

export default CirclePack;
