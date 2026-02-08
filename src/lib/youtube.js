export async function getChannelIdByQuery(apiKey, query) {
  const url = new URL('https://www.googleapis.com/youtube/v3/search')
  url.searchParams.set('part', 'snippet')
  url.searchParams.set('type', 'channel')
  url.searchParams.set('q', query)
  url.searchParams.set('maxResults', '1')
  url.searchParams.set('key', apiKey)
  const res = await fetch(url)
  if (!res.ok) throw new Error('채널 검색 실패')
  const data = await res.json()
  const item = data.items?.[0]
  return item?.snippet?.channelId || item?.id?.channelId
}

export async function getUploadsPlaylistId(apiKey, channelId) {
  const url = new URL('https://www.googleapis.com/youtube/v3/channels')
  url.searchParams.set('part', 'contentDetails')
  url.searchParams.set('id', channelId)
  url.searchParams.set('key', apiKey)
  const res = await fetch(url)
  if (!res.ok) throw new Error('채널 정보 조회 실패')
  const data = await res.json()
  const uploads = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
  return uploads
}

export async function fetchLatestUploads(apiKey, channelId, maxResults = 6) {
  const uploads = await getUploadsPlaylistId(apiKey, channelId)
  if (!uploads) throw new Error('업로드 플레이리스트 없음')
  const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems')
  url.searchParams.set('part', 'snippet,contentDetails')
  url.searchParams.set('playlistId', uploads)
  url.searchParams.set('maxResults', String(maxResults))
  url.searchParams.set('key', apiKey)
  const res = await fetch(url)
  if (!res.ok) throw new Error('업로드 영상 조회 실패')
  const data = await res.json()
  const ids = data.items.map(i => i.contentDetails?.videoId).filter(Boolean).join(',')
  const statsUrl = new URL('https://www.googleapis.com/youtube/v3/videos')
  statsUrl.searchParams.set('part', 'statistics')
  statsUrl.searchParams.set('id', ids)
  statsUrl.searchParams.set('key', apiKey)
  const statsRes = await fetch(statsUrl)
  if (!statsRes.ok) throw new Error('영상 통계 조회 실패')
  const statsData = await statsRes.json()
  const statsMap = new Map(statsData.items.map(v => [v.id, v.statistics]))
  return data.items.map(it => {
    const id = it.contentDetails?.videoId
    const s = id ? statsMap.get(id) : null
    return {
      id,
      title: it.snippet.title,
      date: it.contentDetails?.videoPublishedAt?.slice(0, 10) || it.snippet.publishedAt?.slice(0, 10),
      views: s ? Number(s.viewCount) : 0,
      thumb: it.snippet.thumbnails?.medium?.url || it.snippet.thumbnails?.high?.url,
      url: id ? `https://www.youtube.com/watch?v=${id}` : undefined,
      description: it.snippet.description || '',
    }
  })
}

export async function fetchLatestVideos(apiKey, channelId, maxResults = 6) {
  const url = new URL('https://www.googleapis.com/youtube/v3/search')
  url.searchParams.set('part', 'snippet')
  url.searchParams.set('channelId', channelId)
  url.searchParams.set('order', 'date')
  url.searchParams.set('type', 'video')
  url.searchParams.set('maxResults', String(maxResults))
  url.searchParams.set('key', apiKey)
  const res = await fetch(url)
  if (!res.ok) throw new Error('영상 검색 실패')
  const data = await res.json()
  const ids = data.items.map(i => i.id.videoId).join(',')
  const statsUrl = new URL('https://www.googleapis.com/youtube/v3/videos')
  statsUrl.searchParams.set('part', 'statistics')
  statsUrl.searchParams.set('id', ids)
  statsUrl.searchParams.set('key', apiKey)
  const statsRes = await fetch(statsUrl)
  if (!statsRes.ok) throw new Error('영상 통계 조회 실패')
  const statsData = await statsRes.json()
  const statsMap = new Map(statsData.items.map(v => [v.id, v.statistics]))
  return data.items.map(it => {
    const s = statsMap.get(it.id.videoId)
    return {
      id: it.id.videoId,
      title: it.snippet.title,
      date: it.snippet.publishedAt.slice(0, 10),
      views: s ? Number(s.viewCount) : 0,
      thumb: it.snippet.thumbnails?.medium?.url || it.snippet.thumbnails?.high?.url,
      url: `https://www.youtube.com/watch?v=${it.id.videoId}`,
      description: it.snippet.description || '',
    }
  })
}
