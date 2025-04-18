import { useRouter } from 'next/router';
import Image from 'next/image';
import figuresData from '../../data/figures.json';
import Layout from '../../components/Layout';

export default function FigurePage() {
  const router = useRouter();
  const { id } = router.query;
  
  const figure = figuresData.find(fig => fig.id === id);
  
  if (!figure) {
    return (
      <Layout>
        <div>Figure not found</div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">{figure.title}</h1>
      <div className="relative w-full h-[600px]">
        <Image 
          src={figure.path}
          alt={figure.title}
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
    </Layout>
  );
}