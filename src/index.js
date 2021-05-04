import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import ZoomableCirclePack from "./components/ZoomableCirclePack";
import ArcTextZoomableCirclePacking from "./components/ArcTextZoomableCirclePacking";

import { dummyPosts, dummyRelations } from "./data/postDummyData.js";

ReactDOM.render(
  <React.StrictMode>
    <ZoomableCirclePack
      posts={dummyPosts}
      relations={dummyRelations}
      width={700}
      height={700}
    />
    {/* <ArcTextZoomableCirclePacking posts=dummyPosts> */}
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
