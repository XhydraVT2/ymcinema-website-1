import { Detail } from "../../../lib/Detail";

export default async function Page({ params }) {
  const { id } = await params;
  return <Detail type="tv" id={id} />;
}
