import React from "react";
import "../styles/loading.css"
function Loading() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
<div class="card">
  <div class="loader">
    <p>loading</p>
    <div class="words">
      <span class="word">Summarisation</span>
      <span class="word">Pie Chart</span>
      <span class="word">Word Cloud</span>
    </div>
  </div>
</div>
</div>

  );
}

export default Loading;
