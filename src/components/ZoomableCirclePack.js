import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
// import { randomBates } from "d3";

function ZoomableCirclePack(props) {
  var width = props.width;
  var height = props.height;
  const svgRef = useRef();

  // console.log(generateData());

  useEffect(() => {
    let color = d3
      .scaleLinear()
      .domain([0, 5])
      .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl);

    let grayColor = d3
      .scaleLinear()
      .domain([0, 5])
      .range(["hsla(0,0%,40%, 0.3)", "hsl(0,0%,0%, 0.3)"])
      .interpolate(d3.interpolateHcl);

    let pack = (data) =>
      d3.pack().size([width, height]).padding(3)(
        d3
          .hierarchy(data)
          .sum((d) => d.value)
          .sort((a, b) => b.value - a.value)
      );

    // const root = pack(formatData(props.posts, props.relations, ["Idea"]));

    const root = pack(generateData());

    let focus = root;
    let view;

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [
        //we are just adding space (the +100) between the circles and the edges so that nothing get's cut off
        -(width + 100) / 2,
        -(height + 100) / 2,
        width + 100,
        height + 100,
      ])
      //change the cursor to pointer when on the svg
      .style("cursor", "pointer")
      //set the background color of the svg
      .style("background-color", "#A3F5CF")
      //when we click on the background, zoom to the root
      .on("click", (event) => zoom(event, root));

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(root.descendants().slice(1))
      .join("circle")
      .attr("pointer-events", (d) => (!d.children ? "none" : null))
      .attr("fill", (d) => {
        if (d.data.filterOut === true) {
          //if the circle is to be filtered out, make it gray.
          let col = grayColor(d.depth);
          console.log(col);
          return col;
          // return color(d.depth);
        } else if (d.children) {
          //if the circle is not filtered out, and has children, then color it according to d3's coloring tools (line 11)
          let col = color(d.depth);
          console.log(col);
          return col;
        } else {
          //if the circle is a leaf, make it white
          return "white";
        }
      })
      .style("display", "block")
      .on("mouseover", function () {
        //when we mouse over a circle, add an outline around it
        d3.select(this).attr("stroke", "#000000");
      })
      .on("mouseout", function () {
        //when we take our mouse off of a circle, remove the outline from it
        d3.select(this).attr("stroke", null);
      })
      .on(
        "click",
        (event, d) => focus !== d && (zoom(event, d), event.stopPropagation())
      )
      .on(
        //when we double click, open google
        "dblclick",
        () => window.open("https://www.google.com/")
      );

    //adding a grouping for all labels
    const label = svg
      .append("g")
      //don't let the label interfere with clicking the circles (we can click through the text)
      .attr("pointer-events", "none")
      .style("font-weight", "bold")
      .style(
        //add a slight border to make text stand out
        "text-shadow",
        "0 0 2px white, 0 0 2px white, 0 0 2px white, 0 0 2px white"
      )
      .attr("text-anchor", "middle")
      .selectAll("text")
      //for each descendant of the root, we're going to create a label
      .data(root.descendants())
      .join("text")
      .style("font", () => "25px sans-serif")
      // .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
      .style("display", (d) => (d.parent === root ? "inline" : "none"))
      .text((d) => d.data.title);

    //adding a grouping for all icons
    const icon = svg
      .append("g")
      //don't let the icon interfere with clicking the circles (we can click through the icon)
      .attr("pointer-events", "none")
      .style("font", "20px sans-serif")
      .style("fill", "blue")
      .style(
        "text-shadow",
        "0 0 2px white, 0 0 2px white, 0 0 2px white, 0 0 2px white"
      )
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll("text")
      //for each descendant of the root, we're going to create an icon
      .data(root.descendants())
      .join("text")
      .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
      .style("display", (d) => (d.parent === root ? "inline" : "none"))
      .attr("class", "material-icons")
      .text((d) => d.data.icon);

    //initial zoom
    zoomTo([root.x, root.y, root.r * 2]);

    function zoomTo(v) {
      const k = width / v[2];

      view = v;

      label.attr("transform", (d) =>
        //if our circle has children, we put the label on top of the circle. If not, we put it in the middle
        d.children == null
          ? `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
          : `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k - d.r * k - 10})`
      );

      icon.attr("transform", (d) =>
        //if our circle has children, we put the icon on top of the circle. If not, we put it in the middle
        d.children == null
          ? `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k - 20})`
          : `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k - d.r * k - 30})`
      );

      node.attr(
        "transform",
        (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
      );

      node.attr("r", (d) => d.r * k);
    }

    function zoom(event, d) {
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
          return (
            d.parent === focus ||
            (d.parent != null && d.parent.parent === focus) ||
            this.style.display === "inline"
          );
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

  return <svg ref={svgRef} width={width} height={height}></svg>;
}

function formatData(posts, relations, filter) {
  //Array containing the root objects (the parents)
  let roots = [];

  //map to get posts by id {postID, postObject}
  let postsMap = new Map();

  //maps the type of post to the color that the circle should be (not currently in use)
  let colorMap = new Map();
  colorMap.set("Idea", "#086788)");
  colorMap.set("Topic", "#07A0C3");
  colorMap.set("Concern", "#F0C808");
  colorMap.set("Information", "#FFF1D0");
  colorMap.set("Action Item", "#DD1C1A");
  colorMap.set("Event", "#554348");
  colorMap.set("Question", "#7E3F8F");

  //maps the type of post to the icon that the label should have
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
    if (filter.includes(post.type)) {
      return;
    }

    //give each post object a children array
    post.children = [];

    //the value attribute determines how to scale the circle size. Right now, the more votes, the bigger the value and thus the bigger the circle
    post.value = post.votes;

    //the color attribute is not currently as use, as we are using d3's color tools.
    post.color = colorMap.get(post.type);

    //the icon attribute simply allows us to keep track of the string needed to get the correct icon
    post.icon = iconMap.get(post.type);

    //the filterOut attributes tells us whether we need to gray out the circle, depending on the "filter" parameter.
    post.filterOut = filter.includes(post.type);

    //map each post by its ID (if we need to get the post later by the relation that it's in, we can just find it by its ID)
    postsMap.set(post._id, post);

    //fill the roots array with all posts (we will remove non-roots later - once we see that a node is a child it cannot be a root, so we'll remove it)
    roots.push(post);
  });

  //filter through each relation
  for (let i = 0; i < relations.length; i++) {
    if (!postsMap.has(relations[i].post1)) continue;
    if (!postsMap.has(relations[i].post2)) continue;

    //get the parent and child of the relation
    let parent = postsMap.get(relations[i].post1);
    let child = postsMap.get(relations[i].post2);

    //add the child to the parent's children array.
    parent.children.push(child);

    //remove child from the roots array (no child can be a root)
    if (roots.includes(child)) roots.splice(roots.indexOf(child), 1);
  }

  //return a new root containing all of the old roots as children.
  return {
    children: roots,
  };
}

function generateData() {
  var root = { children: [] };
  addChildren(root, 0);

  return root;

  function addChildren(parentObj, depth) {
    if (depth > 5) {
      return;
    }
    for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
      let childObj = {
        title: "object" + i,
        children: [],
        value: Math.floor(Math.random() * 100),
      };
      parentObj.children.push(childObj);
      addChildren(childObj, depth + 1);
    }
  }
}

export default ZoomableCirclePack;
