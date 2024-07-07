import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import domtoimage from 'dom-to-image'
import { useTreemapCapture } from '~/composables/capture'

vi.mock('dom-to-image', () => ({
  default: {
    toPng: vi.fn().mockResolvedValue('mockedDataUrl'),
  },
}))

describe('useTreemapCapture', () => {
  let mockTreemapElement: HTMLElement

  beforeEach(() => {
    mockTreemapElement = document.createElement('div')
    mockTreemapElement.className = 'treemap'
    document.body.appendChild(mockTreemapElement)

    Object.defineProperty(mockTreemapElement, 'scrollWidth', { value: 1000 })
    Object.defineProperty(mockTreemapElement, 'offsetHeight', { value: 400 })
    mockTreemapElement.style.width = '1000px'
    mockTreemapElement.style.height = '400px'

    vi.spyOn(document, 'querySelector').mockReturnValue(mockTreemapElement)
  })

  afterEach(() => {
    document.body.removeChild(mockTreemapElement)
    vi.restoreAllMocks()
  })

  it('should capture treemap successfully', async () => {
    const { captureTreeMap } = useTreemapCapture()

    const createElementSpy = vi.spyOn(document, 'createElement')
    const linkClickSpy = vi.fn()

    createElementSpy.mockReturnValue({
      href: '',
      download: '',
      click: linkClickSpy,
    } as unknown as HTMLAnchorElement)

    await captureTreeMap()

    expect(document.querySelector).toHaveBeenCalledWith('.treemap')
    expect(mockTreemapElement.style.width).toBe('1000px')
    expect(mockTreemapElement.style.height).toBe('400px')
    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(linkClickSpy).toHaveBeenCalled()
  })

  it('should handle errors when treemap element is not found', async () => {
    vi.spyOn(document, 'querySelector').mockReturnValue(null)
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { captureTreeMap } = useTreemapCapture()
    await captureTreeMap()

    expect(consoleSpy).toHaveBeenCalledWith('Treemap element not found')
  })

  it('should handle errors during image capture', async () => {
    const mockError = new Error('Capture failed')
    vi.spyOn(domtoimage, 'toPng').mockRejectedValue(mockError)

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { captureTreeMap } = useTreemapCapture()
    await captureTreeMap()

    expect(consoleSpy).toHaveBeenCalledWith('Error capturing treemap:', mockError)
  })

  it('should restore original styles after capture', async () => {
    const { captureTreeMap } = useTreemapCapture()

    const originalWidth = mockTreemapElement.style.width
    const originalHeight = mockTreemapElement.style.height

    await captureTreeMap()

    expect(mockTreemapElement.style.width).toBe(originalWidth)
    expect(mockTreemapElement.style.height).toBe(originalHeight)
  })
})
