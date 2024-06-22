import type { H3Event, EventHandlerRequest } from 'h3'
import { $fetch } from 'ofetch'
import type { Section } from '~~/types'

async function fetchConfig(model: string): Promise<Section[]> {
  return await $fetch(`/configs/${model}.json`, { baseURL: useRuntimeConfig().apiUrl })
}

export default defineCachedEventHandler(async (event: H3Event<EventHandlerRequest>): Promise<Section[]> => {
  const { model } = getQuery(event) as { model?: string }

  if (!model) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Must provide a model.',
    })
  }

  return fetchConfig(model)
})
