
import { CreateEntityForm} from "@/components/entities/CreateEntityForm";

async function getMetadata() {
  const res = await fetch('http://localhost:3000/api/metadata', {
    cache: 'no-store' // eller 'force-cache' beroende på behov
  });
  if (!res.ok) throw new Error('Failed to fetch metadata');
  return res.json();
}
export default async function CreateEntity() {
  const metadata = await getMetadata();

  return (
    <div>
        <CreateEntityForm />

    </div>
  );
}