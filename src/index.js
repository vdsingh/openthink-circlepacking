import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import ZoomableCirclePack from "./components/ZoomableCirclePack";
import ArcTextZoomableCirclePacking from "./components/ArcTextZoomableCirclePacking";

import { dummyPosts, dummyRelations } from "./data/postDummyData.js";

const generatedData = generateData(3, 5);
const unformattedData = unformatData(generatedData);

console.log(generatedData);
console.log(unformatData(generatedData));

ReactDOM.render(
  <React.StrictMode>
    {/* If the two visualizations below are not exactly the same, there is a problem with formatData */}
    {/* Create the Component using raw generated hierarchical data. There is no preprocessing involved. This data is similar to that of the standard flare.json data*/}
    <ZoomableCirclePack data={generatedData} width={700} height={700} />

    {/* Unformat the generated data and then reformat it later in the formatData function (we're basically just making sure that the formatData function works as intended). In this case, preprocessing will occur*/}
    <ZoomableCirclePack
      posts={unformattedData[0]}
      relations={unformattedData[1]}
      width={700}
      height={700}
    />
  </React.StrictMode>,
  document.getElementById("root")
);

/**
 * Generates a random data tree (to eventually be used in visualization) based on specified parameters. Note: this data is in hierarchical form - objects have a children attribute (there is no "posts" and "relations". To convert it to that format, see unformatData). The format of the data generated is similar to that of flare.json
 * @param  {Number} maxDepth    The maximum depth that you want the tree data to go to
 * @param  {Number} maxChildren The maximum number of children that any node can have (it will pick a random number in the range)
 * @return {Object}             The root node of the tree data
 */
function generateData(maxDepth, maxChildren) {
  var root = { children: [] };
  var idCounter = 0;
  addChildren(root, 0, maxDepth);

  return root;

  function addChildren(parentObj, depth, maxDepth) {
    if (depth > maxDepth) {
      return;
    }
    for (let i = 0; i < Math.floor(Math.random() * maxChildren) + 1; i++) {
      let randomVal = Math.floor(Math.random() * 100);
      let childObj = {
        title: "object" + i,
        children: [],
        value: randomVal,
        _id: idCounter++,
        type: "Idea",
        votes: randomVal,
      };
      parentObj.children.push(childObj);
      addChildren(childObj, depth + 1, maxDepth);
    }
  }
}

/**
 * unformats data in order to test the format data function. Takes hierarchical data (in the form of flare.json for example). Then converts it to an array of posts and an array of relations. You can then reformat this data using formatData, and if the visual output is different than the visual for the raw data (that was passed in), there is an issue with formatting the data.
 * @param  {Object} root The maximum number of children that any node can have (it will pick a random number in the range)
 * @return {Array}       Array containing the posts array (0) and the relations array (1)
 */
function unformatData(root) {
  let posts = [];
  let relations = [];

  decompose(root);

  return [posts, relations];

  //decompose is a recursive function that adds the current node to the posts array, and the relation between the current node and its children to the relations array. Then it is called on its children, so that they do the same.
  function decompose(node) {
    //we don't want to include the initial root in the posts because it isn't included in the visualization.
    if (node != root) posts.push(node);
    for (let i = 0; i < node.children.length; i++) {
      let child = node.children[i];
      let relation = { post1: node._id, post2: child._id };
      relations.push(relation);
      decompose(child);
    }
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
