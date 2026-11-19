import SignupForm from './SignupForm';
import { isRequestOffer } from '../../lib/engagement-offers';

export default async function SignupPage({ searchParams }: {
  searchParams: Promise<{ offer?: string | string[] }>;
}) {
  const { offer } = await searchParams;
  const selected = isRequestOffer(offer) ? offer : null;
  return <SignupForm key={selected ?? 'choose'} initialOffer={selected} />;
}
