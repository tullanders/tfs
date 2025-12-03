'use client';

import { TdsButton } from '@scania/tegel-react';
import Button from '@/components/tegelWraps/Button';

export default function Page() {


  return <>
        <h1>All legal items:</h1>
        <h3>Hello from About Page </h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      <hr />
        <TdsButton text="Click me!" />
        <hr />
        <Button variant="primary" size="md">
          Custom Button
        </Button>
        <hr />

        <input type="text" placeholder="Type here..." />
        <hr />
        <textarea name="" id=""></textarea>
      </>
}