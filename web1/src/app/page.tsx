"use client";

import { useEffect } from "react";

//import styles from "./page.module.css";
import { defineCustomElements } from "@scania/tegel/loader";
import { TdsButton } from "@scania/tegel-react";



export default function Home() {
  useEffect(() => {
    defineCustomElements(); // Needs to be run in the browser once, before any elements are used.
  }, []);

  return (
<div>
      <h1>Welcome to the Scania React Demo!</h1>
      <p>This is the home page of the demo application.</p>
      <hr />
      <TdsButton text="Click me!" />
</div>
  );
}
