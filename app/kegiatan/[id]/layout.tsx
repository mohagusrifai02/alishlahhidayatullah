import type { Metadata } from 'next';
import dbConnect from '@/lib/mongodb';
import { News } from '@/models/News';
import { Types } from 'mongoose';

interface NewsMetadata {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  publishedAt: string;
}

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return {
        title: 'Berita Tidak Ditemukan - Pemhida Tegal',
      };
    }

    await dbConnect();
    const news = await News.findById(id).lean<NewsMetadata>();

    if (!news) {
      return {
        title: 'Berita Tidak Ditemukan - Pemhida Tegal',
      };
    }

    return {
      title: news.title,
      description: news.excerpt,
      openGraph: {
        title: news.title,
        description: news.excerpt,
        type: 'article',
        url: `https://pemhida-tegal.vercel.app/news/${news._id}`,
        siteName: 'Pemhida Tegal',
        images: [
          {
            url: news.image,
            width: 1200,
            height: 630,
            alt: news.title,
          },
        ],
        locale: 'id_ID',
        publishedTime: news.publishedAt,
        authors: ['Pemhida Tegal'],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Berita - Pemhida Tegal',
      description: 'Portal resmi Pemuda Hidayatullah Tegal',
    };
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
