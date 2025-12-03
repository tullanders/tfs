import Breadcrumbs from '@/components/Breadcrumbs';

import Button from '@/components/tegelWraps/Button';
import Textarea from '@/components/tegelWraps/Textarea';
import TextField from '@/components/tegelWraps/TextField';

export default async function Page({ params }: { params: { id: string } } ) {


  const {id} = await params
  return (
    <>

      <h1>Legal item: {id}</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor eligendi accusamus, facilis fugit explicabo qui totam officiis tempora assumenda nobis? Cupiditate ullam delectus sapiente excepturi autem inventore, explicabo libero voluptatum.</p>
      <h3>Hello from About Page {id}</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

<hr />
      <TextField label="Example TextField" size="sm" placeholder="Type here..." />
      <hr />
      <Button text="Custom Button" variant="primary" size="sm" />
      <hr />
      <input type="text" placeholder="Type here..." />
      <hr />
      <Textarea label="Example Textarea" size="sm" placeholder="Type here..." />   
      
    </>
  );
}