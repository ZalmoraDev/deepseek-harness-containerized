/**
 * SearXNG search provider for the dsh web seam (`ctx.web`).
 *
 * Registers provider id `searxng`, so `web.searchProvider: searxng` (or
 * `$DSH_WEB_SEARCH_PROVIDER=searxng`) resolves to this file instead of a
 * packaged provider. It has no dependencies and no build step: the loader
 * imports it straight from this profile.
 *
 * Contract (see @deepseek-ai/dsh-web): a provider has an `id`, a cheap local
 * `available()` check that never touches the network, and `search()`, which
 * returns normalized `{ content?, sources[], truncated }`.
 */

export const name = 'search-searxng'

/** The web seam this provider registers into. */
export const inject = ['web']

const DEFAULT_BASE_URL = 'http://searxng:8080'
const DEFAULT_TIMEOUT_MS = 15_000

/**
 * @param {import('@deepseek-ai/cordis').Context} ctx
 * @param {{
 *   baseURL?: string,
 *   language?: string,
 *   categories?: string,
 *   safesearch?: 0 | 1 | 2,
 *   timeoutMs?: number,
 * }} [config]
 */
export function apply(ctx, config = {}) {
  const baseURL = String(config.baseURL ?? process.env.SEARXNG_BASE_URL ?? DEFAULT_BASE_URL)
    .replace(/\/+$/, '')
  const timeoutMs = Number(config.timeoutMs ?? DEFAULT_TIMEOUT_MS)
  const origin = new URL(baseURL).origin

  ctx.web.registerSearchProvider({
    id: 'searxng',

    // Cheap local check only: the instance is container-local and a network
    // probe here would make provider selection slow and non-deterministic.
    available: () => true,

    async search(request, signal) {
      const url = new URL(`${baseURL}/search`)
      url.searchParams.set('q', request.query)
      url.searchParams.set('format', 'json')
      if (config.language) url.searchParams.set('language', config.language)
      if (config.categories) url.searchParams.set('categories', config.categories)
      if (config.safesearch !== undefined) url.searchParams.set('safesearch', String(config.safesearch))

      // One deadline for the whole call, composed with the caller's signal so
      // either a cancelled request or a hung instance ends the search.
      const deadline = AbortSignal.timeout(timeoutMs)
      const composed = signal ? AbortSignal.any([signal, deadline]) : deadline

      let response
      try {
        response = await fetch(url, { signal: composed, headers: { accept: 'application/json' } })
      } catch (error) {
        if (signal?.aborted) throw error
        const reason = error instanceof Error ? error.message : String(error)
        throw new Error(`searxng: cannot reach ${origin} (${reason}); is the SearXNG container running?`)
      }

      if (response.status === 403) {
        throw new Error(
          `searxng: HTTP 403 from ${origin} — JSON output is disabled on the instance; `
          + 'add `json` to `search.formats` in its settings.yml and restart it',
        )
      }
      if (!response.ok) {
        throw new Error(`searxng: HTTP ${response.status} ${response.statusText || ''} from ${origin}`.trim())
      }

      let body
      try {
        body = await response.json()
      } catch {
        throw new Error(
          `searxng: response from ${origin} is not JSON — `
          + '`format=json` is probably disabled on the instance',
        )
      }

      const sources = (Array.isArray(body?.results) ? body.results : [])
        .filter(result => typeof result?.url === 'string' && result.url.length > 0)
        .map(result => ({
          url: result.url,
          ...(typeof result.title === 'string' && result.title ? { title: result.title } : {}),
          ...(typeof result.content === 'string' && result.content ? { snippet: result.content } : {}),
          ...(typeof result.publishedDate === 'string' && result.publishedDate
            ? { publishedAt: result.publishedDate }
            : {}),
        }))

      // Instant answers (calculator, Wikipedia-style infoboxes) map to the
      // seam's optional `content`; ordinary searches simply have none.
      const answers = (Array.isArray(body?.answers) ? body.answers : [])
        .map(answer => answer?.answer)
        .filter(answer => typeof answer === 'string' && answer.length > 0)

      return {
        ...(answers.length > 0 ? { content: answers.join('\n\n') } : {}),
        sources,
        truncated: false,
      }
    },
  })
}
