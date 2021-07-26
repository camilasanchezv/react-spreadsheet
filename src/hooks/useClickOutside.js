import { useEffect } from 'react'

export function useOnClickOutside(handler, ref) {

    useEffect(() => {
        const listener = (event) => {
            const element = ref?.current
            const clickInsideElement = !element || element.contains(event.target)
            if (!clickInsideElement) handler(event)
        }

        document.addEventListener('mousedown', listener)
        document.addEventListener('touchstart', listener)

        return () => {
            document.removeEventListener('mousedown', listener)
            document.removeEventListener('touchstart', listener)
        }

    }, [ref, handler])
}