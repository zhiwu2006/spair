import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-100 to-blue-200">
      <h1 className="text-4xl font-bold mb-8 text-blue-800">英语句子重组游戏</h1>
      <Link href="/game">
        <Button className="text-lg px-6 py-3">开始游戏</Button>
      </Link>
    </div>
  );
}