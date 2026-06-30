'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // Проверь, что путь совпадает с твоим реальным расположением клиента

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // supabase-js при инициализации клиента (detectSessionInUrl: true — значение по умолчанию)
    // сам разбирает хэш (#access_token=...&refresh_token=...&type=signup) из URL.
    // Достаточно дождаться события SIGNED_IN/INITIAL_SESSION через onAuthStateChange.

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Callback auth event:', event, session);

      if (session?.user) {
        // Сессия успешно установлена — очищаем хэш и уводим на главную
        window.history.replaceState(null, '', '/auth/callback');
        router.replace('/');
      }
    });

    // На случай, если событие уже произошло до подписки (быстрая обработка хэша)
    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (sessionError) {
        setError(sessionError.message);
        return;
      }
      if (session?.user) {
        router.replace('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 gap-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      <p className="text-sm text-slate-500 font-medium">
        Подтверждение входа...
      </p>
      {error && (
        <p className="text-sm text-red-500 font-semibold max-w-sm text-center">
          {error}
        </p>
      )}
    </div>
  );
}
