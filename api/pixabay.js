// Vercel 서버리스 함수: 환경변수 PIXABAY_KEY 로 Pixabay API 를 대신 호출한다.
export default async function handler(req, res) {
  const key = process.env.PIXABAY_KEY;
  if (!key) {
    res.status(500).send('서버에 PIXABAY_KEY 환경변수가 설정되지 않았어요.');
    return;
  }

  const q = String(req.query.q || '').slice(0, 100);
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);

  const url = 'https://pixabay.com/api/?' + new URLSearchParams({
    key,
    q,
    page,
    per_page: 10,
    image_type: 'photo',
    lang: 'ko',
    safesearch: 'true'
  });

  const upstream = await fetch(url);
  const body = await upstream.text();

  // Pixabay 규칙: 결과를 24시간 캐시
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  res.status(upstream.status).send(body);
}
