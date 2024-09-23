import domtoimage from 'dom-to-image'

export function useTreemapCapture() {
  const calculateTotalHeight = (element: HTMLElement): number => {
    let totalHeight = element.offsetHeight
    const children = element.children

    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement
      const childBottom = child.offsetTop + child.offsetHeight
      totalHeight = Math.max(totalHeight, childBottom)
    }

    return totalHeight
  }

  const captureTreeMap = async () => {
    const treemapElement = document.querySelector('.treemap') as HTMLElement | null

    if (!treemapElement) {
      console.error('Treemap element not found')
      return
    }

    const originalStyles = {
      width: treemapElement.style.width,
      height: treemapElement.style.height,
      position: treemapElement.style.position,
      overflow: treemapElement.style.overflow,
      maxWidth: treemapElement.style.maxWidth,
      maxHeight: treemapElement.style.maxHeight,
    }

    const contentWidth = treemapElement.scrollWidth
    const contentHeight = calculateTotalHeight(treemapElement)

    Object.assign(treemapElement.style, {
      width: `${contentWidth}px`,
      height: `${contentHeight}px`,
      position: 'relative',
      overflow: 'visible',
      maxWidth: 'none',
      maxHeight: 'none',
    })

    try {
      treemapElement.offsetHeight // Force layout recalculation

      const dataUrl = await domtoimage.toPng(treemapElement, {
        height: contentHeight,
        width: contentWidth,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
      })

      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `clover-map-${Date.now()}.png`
      link.click()
    }
    catch (error) {
      console.error('Error capturing treemap:', error)
    }
    finally {
      Object.assign(treemapElement.style, originalStyles)
    }
  }

  return {
    captureTreeMap,
  }
}
