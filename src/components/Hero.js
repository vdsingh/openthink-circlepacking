import React, { useEffect, useRef } from "react";

import Heading from "./Heading";

export default function Hero() {
  return (
    <div className="wrapper">
      <Heading text="Hello World!" arc={120} radius={400} />
    </div>
  );
}
