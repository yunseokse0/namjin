import { useState, useEffect } from 'react'
import { getChannelIdByQuery, fetchLatestUploads } from './lib/youtube'

function Header() {
  return (
    <header className="border-b border-zinc-800/60 bg-zinc-900/60 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-gradient-to-tr from-accent to-amber-600" />
          <span className="text-xl font-bold">왔다남진</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#" className="hover:text-accent">홈</a>
          <a href="#videos" className="hover:text-accent">영상</a>
          <a href="#posts" className="hover:text-accent">게시물</a>
          <a href="#support" className="hover:text-accent">후원</a>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="https://www.youtube.com/@왔다남진"
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
          >
            <img src="/youtubeicon.png" alt="YouTube" className="h-4 w-4" />
            채널 바로가기
          </a>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative">
      <div className="absolute inset-0 -z-10">
        <div
          className="h-[380px] sm:h-[520px] w-full bg-center bg-cover"
          style={{
            backgroundImage: "url('/channel-art.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0F0F0F]" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <div className="mx-auto size-28 sm:size-36 rounded-full overflow-hidden neon-glow ring-2 ring-amber-400">
            <img
              src="/channels4_profile.jpg"
              alt="왔다남진 프로필"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter">
            왔다남진
          </h1>
          <p className="text-zinc-300 text-sm sm:text-lg">
            도파민이 부족한 남진입니다
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a
              href="https://www.youtube.com/@왔다남진"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 px-5 py-2.5 font-semibold text-black shadow-soft hover:scale-[1.02] transition"
            >
              <img src="/youtubeicon.png" alt="YouTube" className="h-5 w-5" />
              유튜브 채널
            </a>
            <a
              href="#support"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2.5 text-zinc-200 hover:bg-zinc-800 transition"
            >
              후원하기
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatCards() {
  const stats = [
    { label: '구독자 수', value: 230 },
    { label: '동영상 수', value: 29 },
    { label: '총 조회수', value: 23252 },
  ]
  const fmt = (n) => Intl.NumberFormat('ko-KR').format(n)
  function CountUp({ to }) {
    const [n, setN] = useState(0)
    useEffect(() => {
      const start = performance.now()
      const d = 900
      let raf
      const tick = (t) => {
        const p = Math.min(1, (t - start) / d)
        setN(Math.floor(p * to))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(raf)
    }, [to])
    return <>{fmt(n)}</>
  }
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:overflow-visible">
        {stats.map((s) => (
          <div key={s.label} className="min-w-[240px] sm:min-w-0 snap-start relative rounded-2xl bg-zinc-800/80 grid-pattern noise-overlay backdrop-blur-md shadow-soft border border-white/10 p-6">
            <div className="text-xs sm:text-sm text-zinc-400">{s.label}</div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold tabular-nums">
              <CountUp to={s.value} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function VideoGrid() {
  const [videos, setVideos] = useState([])
  useEffect(() => {
    const run = async () => {
      try {
        const key = import.meta.env.VITE_YT_API_KEY
        if (!key) throw new Error('API 키가 없습니다')
        const channelId = await getChannelIdByQuery(key, '왔다남진')
        if (!channelId) throw new Error('채널을 찾지 못했습니다')
        const list = await fetchLatestUploads(key, channelId, 6)
        setVideos(list)
      } catch {
        setVideos(
          Array.from({ length: 6 }).map((_, i) => ({
            id: i + 1,
            title: `영상 제목 ${i + 1}`,
            date: '2026-01-15',
            views: 1200 * (i + 1),
            thumb: '',
            url: 'https://www.youtube.com/@왔다남진',
            description: '',
          })),
        )
      }
    }
    run()
  }, [])
  const fmt = (n) => Intl.NumberFormat('ko-KR').format(n)
  return (
    <section id="videos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold">최신 영상 리스트</h2>
        <a
          href="https://www.youtube.com/@왔다남진"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-accent hover:underline"
        >
          채널 바로가기
        </a>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((v) => (
          <a
            key={v.id}
            href={v.url || "https://www.youtube.com/@왔다남진"}
            target="_blank"
            rel="noreferrer"
            className="group relative rounded-2xl bg-zinc-800/80 backdrop-blur-md shadow-soft border border-white/10 overflow-hidden transition-transform hover:-translate-y-1 hover:scale-[1.02] hover:border-amber-500"
          >
            <span className="badge bg-amber-500/30 text-white">NEW</span>
            <div className="aspect-video bg-zinc-700 relative">
              {v.thumb ? (
                <img src={v.thumb} alt={v.title} className="absolute inset-0 w-full h-full object-cover" />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 scale-100 group-hover:scale-[1.03] transition-transform" />
            </div>
            <div className="p-4">
              <div className="font-semibold truncate">{v.title}</div>
              <div className="mt-1 text-sm text-zinc-400">
                {v.date} · 조회수 {fmt(v.views)}회
              </div>
            </div>
          </a>
        ))}
      </div>
      <div className="mt-10 flex items-center justify-center">
        <div className="text-5xl font-extrabold tracking-tighter text-white/5 select-none">
          WADDA NAMJIN
        </div>
      </div>
    </section>
  )
}

import { posts as localPosts } from './data/posts'
function Posts() {
  const [selected, setSelected] = useState(null)
  return (
    <section id="posts" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold">게시물</h2>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {localPosts.map((p) => (
          <button key={p.id} onClick={() => setSelected(p)} className="text-left group rounded-2xl bg-zinc-800/80 backdrop-blur-md shadow-soft border border-white/10 p-6 hover:border-amber-500 transition">
            <div className="text-sm text-zinc-400">{p.date}</div>
            <div className="mt-2 font-semibold">{p.title}</div>
            <div className="mt-2 text-zinc-300 text-sm">{p.excerpt}</div>
            <div className="mt-4 text-amber-400 text-sm">자세히 보기</div>
          </button>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-zinc-900 border border-white/10 p-6">
            <div className="text-sm text-zinc-400">{selected.date}</div>
            <div className="mt-2 font-semibold text-lg">{selected.title}</div>
            <div className="mt-3 text-zinc-300 text-sm whitespace-pre-line">{selected.content}</div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelected(null)} className="rounded-lg border border-white/10 px-4 py-2 text-zinc-200 hover:bg-zinc-800 transition">닫기</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function SupportAndInfo() {
  return (
    <section id="support" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-zinc-800/70 backdrop-blur shadow-soft border border-zinc-700/40 p-6">
          <h3 className="text-xl font-bold">후원하기</h3>
          <p className="mt-2 text-zinc-300">
            남진에게 도파민 충전해주기
          </p>
          <a
            href="https://toon.at/donate/skawls56"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 px-5 py-2.5 font-semibold text-black shadow-soft hover:scale-[1.02] transition mt-4 w-fit"
          >
            투네이션 후원
          </a>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-4">
              <div className="text-sm text-zinc-400">계좌 후원</div>
              <BankInfo />
            </div>
            <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-4">
              <div className="text-sm text-zinc-400">안내</div>
              <p className="mt-2 text-zinc-300 text-sm">
                {import.meta.env.VITE_BANK_NOTE || '계좌 정보는 안전한 환경변수로 관리됩니다. 복사 버튼을 눌러 간편하게 전달할 수 있습니다.'}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-zinc-800/70 backdrop-blur shadow-soft border border-zinc-700/40 p-6">
          <h3 className="text-xl font-bold">채널 정보</h3>
          <p className="mt-3 text-zinc-300">
            게임과 일상, 다양한 실험 콘텐츠로 도파민을 폭발시키는 재미 공장.
            왔다남진 공식 팬페이지에서 웃음·몰입·설렘을 가장 빠르게 받아가세요!
          </p>
        </div>
      </div>
    </section>
  )
}

function BankInfo() {
  const name = import.meta.env.VITE_BANK_NAME || ''
  const holder = import.meta.env.VITE_BANK_HOLDER || ''
  const account = import.meta.env.VITE_BANK_ACCOUNT || ''
  const has = name && holder && account
  const copy = async () => {
    if (!has) return
    const text = `${name} ${account} (${holder})`
    try {
      await navigator.clipboard.writeText(text)
      alert('계좌 정보가 복사되었습니다')
    } catch {
      alert('복사에 실패했습니다')
    }
  }
  return (
    <div className="mt-2">
      {has ? (
        <div className="flex flex-col gap-2">
          <div className="text-sm"><span className="text-zinc-400">은행</span> <span className="font-semibold">{name}</span></div>
          <div className="text-sm"><span className="text-zinc-400">예금주</span> <span className="font-semibold">{holder}</span></div>
          <div className="text-sm"><span className="text-zinc-400">계좌번호</span> <span className="font-semibold">{account}</span></div>
          <button onClick={copy} className="mt-2 inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-zinc-200 hover:bg-zinc-800 transition w-fit">
            복사하기
          </button>
        </div>
      ) : (
        <div className="text-sm text-zinc-400">계좌 정보가 곧 공개됩니다</div>
      )}
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-zinc-400">
          © {new Date().getFullYear()} 왔다남진 팬페이지
        </div>
        <a
          href="https://www.youtube.com/@왔다남진"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-600 px-4 py-2 text-zinc-200 hover:bg-zinc-800 transition-colors"
        >
          유튜브 채널 바로가기
        </a>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-full bg-zinc-900 text-zinc-100 antialiased">
      <Header />
      <Hero />
      <StatCards />
      <VideoGrid />
      <Posts />
      <SupportAndInfo />
      <Footer />
      <a
        href="https://www.youtube.com/@왔다남진"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 text-black flex items-center justify-center shadow-soft hover:scale-105 transition"
        aria-label="유튜브 구독하기"
      >
        <img src="/youtubeicon.png" alt="YouTube" className="h-6 w-6" />
      </a>
      {import.meta.env.VITE_OPENCHAT_URL ? (
        <a
          href={import.meta.env.VITE_OPENCHAT_URL}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-24 z-50 h-14 w-14 rounded-full bg-[#FEE500] text-black flex items-center justify-center shadow-soft hover:scale-105 transition"
          aria-label="카카오 오픈채팅"
          title="카카오 오픈채팅"
        >
          톡
        </a>
      ) : null}
    </div>
  )
}
